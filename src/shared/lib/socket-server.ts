import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

interface SocketUser {
  userId: string;
  name: string;
  avatar: string | null;
}

// Track online users
const onlineUsers = new Map<string, SocketUser>();

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

export function getOnlineUsers() {
  return onlineUsers;
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

    // Authenticate & register user
    socket.on('register', (user: SocketUser) => {
      onlineUsers.set(socket.id, user);
      socket.data.userId = user.userId;
      socket.data.userName = user.name;

      // Broadcast to all that user is online
      io?.emit('user:online', {
        userId: user.userId,
        name: user.name,
      });

      console.log(`[Socket] User registered: ${user.name} (${user.userId})`);
    });

    // Join a chat room
    socket.on('room:join', (roomId: string) => {
      socket.join(roomId);
      console.log(`[Socket] ${socket.data.userName} joined room ${roomId}`);

      // Notify room members
      socket.to(roomId).emit('room:user_joined', {
        userId: socket.data.userId,
        userName: socket.data.userName,
        roomId,
      });
    });

    // Leave a chat room
    socket.on('room:leave', (roomId: string) => {
      socket.leave(roomId);
      socket.to(roomId).emit('room:user_left', {
        userId: socket.data.userId,
        userName: socket.data.userName,
        roomId,
      });
    });

    // Send a message
    socket.on('message:send', (data: { roomId: string; content: string; sender: SocketUser }) => {
      const message = {
        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        roomId: data.roomId,
        senderId: data.sender.userId,
        content: data.content,
        createdAt: new Date().toISOString(),
        sender: data.sender,
      };

      // Broadcast to everyone in the room (including sender for consistency)
      io?.to(data.roomId).emit('message:new', message);
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

    // Disconnect
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
