'use client';

import { useSocket } from '@/shared/providers/socket-provider';
import { useCallback, useEffect, useState } from 'react';
import type { SocketMessage, TypingUser } from '../types';

export function useChatSocket(roomId: string) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  // Join room on mount
  useEffect(() => {
    if (!socket?.connected) return;
    socket.emit('room:join', roomId);
    return () => {
      socket.emit('room:leave', roomId);
    };
  }, [socket?.connected, roomId]);

  // Listen for events
  useEffect(() => {
    if (!socket) return;

    const onMessage = (msg: SocketMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    const onTypingStart = (data: TypingUser & { roomId: string }) => {
      if (data.roomId !== roomId) return;
      setTypingUsers((prev) => {
        if (prev.find((u) => u.userId === data.userId)) return prev;
        return [...prev, { userId: data.userId, userName: data.userName }];
      });
    };

    const onTypingStop = (data: { userId: string; roomId: string }) => {
      if (data.roomId !== roomId) return;
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    socket.on('message:new', onMessage);
    socket.on('typing:user_started', onTypingStart);
    socket.on('typing:user_stopped', onTypingStop);

    return () => {
      socket.off('message:new', onMessage);
      socket.off('typing:user_started', onTypingStart);
      socket.off('typing:user_stopped', onTypingStop);
      setMessages([]);
      setTypingUsers([]);
    };
  }, [socket, roomId]);

  const send = useCallback(
    (content: string, sender: { id: string; name: string; image: string | null }) => {
      if (!socket) return;
      socket.emit('message:send', {
        roomId,
        content,
        sender: {
          userId: sender.id,
          name: sender.name,
          avatar: sender.image,
        },
      });
    },
    [socket, roomId]
  );

  const startTyping = useCallback(() => {
    socket?.emit('typing:start', { roomId });
  }, [socket, roomId]);

  const stopTyping = useCallback(() => {
    socket?.emit('typing:stop', { roomId });
  }, [socket, roomId]);

  return { messages, typingUsers, send, startTyping, stopTyping };
}
