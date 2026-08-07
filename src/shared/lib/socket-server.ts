import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from './prisma';
import { sendSSENotification } from './sse';

const MAX_MESSAGE_LENGTH = 1000;
const MAX_COMMENT_LENGTH = 1000;

let io: SocketIOServer | null = null;

interface SocketUser {
  userId: string;
  name: string;
  avatar: string | null;
}

interface ReplyPayload {
  id: string;
  content: string;
  sender: { id: string; name: string };
}

interface SendMessagePayload {
  roomId: string;
  content: string;
  sender: SocketUser;
  replyTo?: ReplyPayload | null;
  clientId?: string;
  /** Set when forwarding — original author's name, content stays untouched. */
  forwardedFromName?: string | null;
}

type Ack = (response: { message?: unknown; error?: string; success?: boolean }) => void;

const onlineUsers = new Map<string, SocketUser>();

const messageInclude = {
  sender: { select: { id: true, name: true, avatar: true } },
  replyTo: {
    select: { id: true, content: true, sender: { select: { id: true, name: true } } },
  },
} as const;

const commentInclude = {
  user: { select: { id: true, name: true, avatar: true } },
} as const;

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export function getOnlineUsers() {
  return onlineUsers;
}

function personalRoom(userId: string) {
  return `user:${userId}`;
}

async function isRoomMember(roomId: string, userId: string): Promise<boolean> {
  const member = await prisma.chatRoomMember.findFirst({ where: { roomId, userId } });
  return !!member;
}

export function initSocketServer(server: NetServer) {
  if (io) return io;

  io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // ─── Register ─────────────────────────────
    socket.on('register', (user: SocketUser) => {
      onlineUsers.set(socket.id, user);
      socket.data.userId = user.userId;
      socket.data.userName = user.name;
      socket.join(personalRoom(user.userId));

      io?.emit('user:online', { userId: user.userId, name: user.name });

      const currentOnlineUsers = Array.from(onlineUsers.entries())
        .filter(([id]) => id !== socket.id)
        .map(([, u]) => ({ userId: u.userId, name: u.name }));

      socket.emit('users:online_list', currentOnlineUsers);
    });

    // ─── Room Join / Leave ────────────────────
    socket.on('room:join', async (roomId: string) => {
      if (!socket.data.userId) return;
      if (!(await isRoomMember(roomId, socket.data.userId))) {
        console.warn(`[Socket] Denied room:join for non-member ${socket.data.userId} -> ${roomId}`);
        return;
      }
      socket.join(roomId);
      const room = io?.sockets.adapter.rooms.get(roomId);
      io?.to(roomId).emit('room:online_count', room ? room.size : 0);
    });

    socket.on('room:leave', (roomId: string) => {
      socket.leave(roomId);
      const room = io?.sockets.adapter.rooms.get(roomId);
      io?.to(roomId).emit('room:online_count', room ? room.size : 0);
    });

    // ─── Chat Messages ────────────────────────
    socket.on('message:send', async (data: SendMessagePayload, ack?: Ack) => {
      try {
        const userId = socket.data.userId;
        if (!userId) return ack?.({ error: 'ثبت‌نام نشده' });

        if (!(await isRoomMember(data.roomId, userId))) {
          return ack?.({ error: 'Forbidden' });
        }

        const trimmed = (data.content || '').trim();
        if (!trimmed) return ack?.({ error: 'متن پیام نمی‌تواند خالی باشد' });
        if (trimmed.length > MAX_MESSAGE_LENGTH) {
          return ack?.({ error: `پیام نمی‌تواند بیشتر از ${MAX_MESSAGE_LENGTH} کاراکتر باشد` });
        }

        const message = await prisma.chatMessage.create({
          data: {
            roomId: data.roomId,
            senderId: userId,
            content: trimmed,
            replyToId: data.replyTo?.id || null,
            forwardedFromName: data.forwardedFromName || null,
          },
          include: messageInclude,
        });

        await prisma.chatRoom.update({
          where: { id: data.roomId },
          data: { updatedAt: new Date() },
        });

        const payload = { ...message, clientId: data.clientId };
        io?.to(data.roomId).emit('message:new', payload);

        const members = await prisma.chatRoomMember.findMany({
          where: { roomId: data.roomId },
          select: { userId: true },
        });
        for (const member of members) {
          io?.to(personalRoom(member.userId)).emit('room:updated', {
            roomId: data.roomId,
            lastMessage: message,
            isSender: member.userId === userId,
          });
        }

        ack?.({ message: payload });
      } catch (error) {
        console.error('[Socket] message:send error:', error);
        ack?.({ error: 'خطا در ارسال پیام' });
      }
    });

    // ─── Message Delete ───────────────────────
    socket.on('message:delete', async (data: { roomId: string; messageId: string }, ack?: Ack) => {
      try {
        const userId = socket.data.userId;
        if (!userId) return ack?.({ error: 'ثبت‌نام نشده' });

        if (!(await isRoomMember(data.roomId, userId))) {
          return ack?.({ error: 'Forbidden' });
        }

        const message = await prisma.chatMessage.findUnique({
          where: { id: data.messageId },
          select: { senderId: true, roomId: true },
        });

        if (!message) {
          return ack?.({ error: 'پیام یافت نشد' });
        }

        if (message.senderId !== userId) {
          return ack?.({ error: 'فقط فرستنده پیام می‌تواند آن را حذف کند' });
        }

        if (message.roomId !== data.roomId) {
          return ack?.({ error: 'Forbidden' });
        }

        await prisma.chatMessage.delete({ where: { id: data.messageId } });

        // Broadcast deletion to all clients in the room
        io?.to(data.roomId).emit('message:deleted', {
          roomId: data.roomId,
          messageId: data.messageId,
        });

        ack?.({ success: true });
      } catch (error) {
        console.error('[Socket] message:delete error:', error);
        ack?.({ error: 'خطا در حذف پیام' });
      }
    });

    // ─── Message Update (Edit) ────────────────
    socket.on(
      'message:update',
      async (data: { roomId: string; messageId: string; content: string }, ack?: Ack) => {
        try {
          const userId = socket.data.userId;
          if (!userId) return ack?.({ error: 'ثبت‌نام نشده' });

          if (!(await isRoomMember(data.roomId, userId))) {
            return ack?.({ error: 'Forbidden' });
          }

          const trimmed = (data.content || '').trim();
          if (!trimmed) return ack?.({ error: 'متن پیام نمی‌تواند خالی باشد' });
          if (trimmed.length > MAX_MESSAGE_LENGTH) {
            return ack?.({ error: `پیام نمی‌تواند بیشتر از ${MAX_MESSAGE_LENGTH} کاراکتر باشد` });
          }

          const message = await prisma.chatMessage.findUnique({
            where: { id: data.messageId },
            select: { senderId: true, roomId: true },
          });

          if (!message) {
            return ack?.({ error: 'پیام یافت نشد' });
          }

          if (message.senderId !== userId) {
            return ack?.({ error: 'فقط فرستنده پیام می‌تواند آن را ویرایش کند' });
          }

          if (message.roomId !== data.roomId) {
            return ack?.({ error: 'Forbidden' });
          }

          const updated = await prisma.chatMessage.update({
            where: { id: data.messageId },
            data: { content: trimmed, editedAt: new Date() },
            include: messageInclude,
          });

          // Broadcast update to all clients in the room
          io?.to(data.roomId).emit('message:updated', updated);

          ack?.({ message: updated });
        } catch (error) {
          console.error('[Socket] message:update error:', error);
          ack?.({ error: 'خطا در ویرایش پیام' });
        }
      }
    );

    // ─── Task Comments ────────────────────────
    socket.on('comment:add', async (data: { taskId: string; content: string }) => {
      try {
        const userId = socket.data.userId;
        if (!userId) return;

        const trimmed = (data.content || '').trim();
        if (!trimmed) return;
        if (trimmed.length > MAX_COMMENT_LENGTH) return;

        const comment = await prisma.taskComment.create({
          data: {
            taskId: data.taskId,
            userId,
            content: trimmed,
          },
          include: commentInclude,
        });

        io?.emit('comment:new', { taskId: data.taskId, comment });

        const task = await prisma.task.findUnique({
          where: { id: data.taskId },
          select: {
            title: true,
            assigneeId: true,
            creatorId: true,
            project: { select: { name: true } },
          },
        });

        if (task) {
          const notifyUsers = new Set<string>();
          if (task.assigneeId && task.assigneeId !== userId) notifyUsers.add(task.assigneeId);
          if (task.creatorId && task.creatorId !== userId) notifyUsers.add(task.creatorId);

          for (const uid of notifyUsers) {
            await prisma.notification.create({
              data: {
                userId: uid,
                title: 'نظر جدید',
                message: `نظر جدیدی روی تسک "${task.title}" ثبت شد`,
                type: 'COMMENT_ADDED',
              },
            });

            sendSSENotification({
              userId: uid,
              type: 'COMMENT_ADDED',
              title: 'نظر جدید',
              message: `نظر جدیدی روی تسک "${task.title}" ثبت شد`,
              data: { taskId: data.taskId, projectId: task.project?.name },
            });
          }
        }
      } catch (error) {
        console.error('[Socket] comment:add error:', error);
      }
    });

    // ─── Typing Indicator ─────────────────────
    socket.on('typing:start', (data: { roomId: string }) => {
      socket.to(data.roomId).emit('typing:user_started', {
        userId: socket.data.userId,
        userName: socket.data.userName,
        roomId: data.roomId,
      });
    });

    socket.on('typing:stop', (data: { roomId: string }) => {
      socket.to(data.roomId).emit('typing:user_stopped', {
        userId: socket.data.userId,
        roomId: data.roomId,
      });
    });

    // ─── Disconnect ───────────────────────────
    socket.on('disconnect', () => {
      if (socket.data.userId) {
        onlineUsers.delete(socket.id);
        io?.emit('user:offline', {
          userId: socket.data.userId,
          name: socket.data.userName,
        });
      }
    });
  });

  return io;
}
