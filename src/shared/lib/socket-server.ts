import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from './prisma';

const MAX_MESSAGE_LENGTH = 1000;

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
}

type Ack = (response: { message?: unknown; error?: string }) => void;

// Track online users (socket.id -> user)
const onlineUsers = new Map<string, SocketUser>();

const messageInclude = {
  sender: { select: { id: true, name: true, avatar: true } },
  replyTo: {
    select: { id: true, content: true, sender: { select: { id: true, name: true } } },
  },
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

    // Register & authenticate the socket's user, and join their personal
    // room so we can push room-list updates (unread badges, last message)
    // for rooms they belong to but aren't currently viewing.
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

    socket.on('room:join', async (roomId: string) => {
      if (!socket.data.userId) return; // must register first
      if (!(await isRoomMember(roomId, socket.data.userId))) {
        console.warn(`[Socket] Denied room:join for non-member ${socket.data.userId} -> ${roomId}`);
        return;
      }

      socket.join(roomId);
      console.log(`[Socket] ${socket.data.userName} joined room ${roomId}`);

      const room = io?.sockets.adapter.rooms.get(roomId);
      io?.to(roomId).emit('room:online_count', room ? room.size : 0);
    });

    socket.on('room:leave', (roomId: string) => {
      socket.leave(roomId);
      console.log(`[Socket] ${socket.data.userName} left room ${roomId}`);

      const room = io?.sockets.adapter.rooms.get(roomId);
      io?.to(roomId).emit('room:online_count', room ? room.size : 0);
    });

    // Send a message: this is the single source of truth for persistence.
    // The REST endpoint exists only as a fallback for disconnected clients.
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
          },
          include: messageInclude,
        });

        await prisma.chatRoom.update({
          where: { id: data.roomId },
          data: { updatedAt: new Date() },
        });

        const payload = { ...message, clientId: data.clientId };

        // Broadcast to everyone actively viewing the room (including sender).
        io?.to(data.roomId).emit('message:new', payload);

        // Update the room list (last message / unread badge) for every
        // member, even those not currently viewing this room.
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

    // Typing indicator
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

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.data.userName || socket.id}`);

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
