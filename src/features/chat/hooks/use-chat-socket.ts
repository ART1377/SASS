'use client';

import { useSocket } from '@/shared/providers/socket-provider';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReplyInfo, SocketMessage, TypingUser } from '../types';

interface SendPayload {
  content: string;
  sender: { id: string; name: string; image: string | null };
  replyTo?: ReplyInfo;
  clientId: string;
}

interface SendAck {
  message?: SocketMessage;
  error?: string;
}

export function useChatSocket(roomId: string) {
  const { socket, isConnected } = useSocket();
  const [liveMessages, setLiveMessages] = useState<SocketMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!socket || !isConnected) return;

    if (!joinedRef.current) {
      socket.emit('room:join', roomId);
      joinedRef.current = true;
    }

    const onMessage = (msg: SocketMessage) => {
      setLiveMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    };

    const onTypingStart = (data: TypingUser & { roomId: string }) => {
      if (data.roomId !== roomId) return;
      setTypingUsers((prev) =>
        prev.some((u) => u.userId === data.userId)
          ? prev
          : [...prev, { userId: data.userId, userName: data.userName }]
      );
    };

    const onTypingStop = (data: { userId: string; roomId: string }) => {
      if (data.roomId !== roomId) return;
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    const onOnlineCount = (count: number) => setOnlineCount(count);

    socket.on('message:new', onMessage);
    socket.on('typing:user_started', onTypingStart);
    socket.on('typing:user_stopped', onTypingStop);
    socket.on('room:online_count', onOnlineCount);

    return () => {
      socket.off('message:new', onMessage);
      socket.off('typing:user_started', onTypingStart);
      socket.off('typing:user_stopped', onTypingStop);
      socket.off('room:online_count', onOnlineCount);

      socket.emit('room:leave', roomId);
      joinedRef.current = false;
      setLiveMessages([]);
      setTypingUsers([]);
      setOnlineCount(0);
    };
  }, [socket, isConnected, roomId]);

  // Sends via the socket (server persists then broadcasts to the whole
  // room, including the sender) and resolves with the persisted message.
  const send = useCallback(
    (payload: SendPayload): Promise<SocketMessage> => {
      return new Promise((resolve, reject) => {
        if (!socket || !isConnected) {
          reject(new Error('اتصال برقرار نیست'));
          return;
        }
        socket.emit(
          'message:send',
          {
            roomId,
            content: payload.content,
            sender: {
              userId: payload.sender.id,
              name: payload.sender.name,
              avatar: payload.sender.image,
            },
            replyTo: payload.replyTo || null,
            clientId: payload.clientId,
          },
          (ack: SendAck) => {
            if (ack?.error || !ack?.message) {
              reject(new Error(ack?.error || 'خطا در ارسال پیام'));
              return;
            }
            resolve(ack.message);
          }
        );
      });
    },
    [socket, isConnected, roomId]
  );

  const startTyping = useCallback(() => {
    socket?.emit('typing:start', { roomId });
  }, [socket, roomId]);

  const stopTyping = useCallback(() => {
    socket?.emit('typing:stop', { roomId });
  }, [socket, roomId]);

  const registerUser = useCallback(
    (user: { id: string; name: string; image: string | null }) => {
      socket?.emit('register', { userId: user.id, name: user.name, avatar: user.image });
    },
    [socket]
  );

  return {
    liveMessages,
    typingUsers,
    onlineCount,
    send,
    startTyping,
    stopTyping,
    registerUser,
    isConnected,
  };
}
