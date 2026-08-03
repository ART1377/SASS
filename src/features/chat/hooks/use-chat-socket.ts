'use client';

import { useSocket } from '@/shared/providers/socket-provider';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReplyInfo, SocketMessage, TypingUser } from '../types';

export function useChatSocket(roomId: string) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const joinedRef = useRef(false);

  // Single useEffect for all socket events
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join room (only once)
    if (!joinedRef.current) {
      socket.emit('room:join', roomId);
      joinedRef.current = true;
    }

    // Message handlers
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

    const onOnlineCount = (count: number) => {
      setOnlineCount(count);
    };

    socket.on('message:new', onMessage);
    socket.on('typing:user_started', onTypingStart);
    socket.on('typing:user_stopped', onTypingStop);
    socket.on('room:online_count', onOnlineCount);

    return () => {
      socket.off('message:new', onMessage);
      socket.off('typing:user_started', onTypingStart);
      socket.off('typing:user_stopped', onTypingStop);
      socket.off('room:online_count', onOnlineCount);

      // Leave room
      socket.emit('room:leave', roomId);
      joinedRef.current = false;
      setMessages([]);
      setTypingUsers([]);
      setOnlineCount(0);
    };
  }, [socket, isConnected, roomId]);

  const send = useCallback(
    (
      content: string,
      sender: { id: string; name: string; image: string | null },
      replyTo?: ReplyInfo
    ) => {
      if (!socket) return;
      socket.emit('message:send', {
        roomId,
        content,
        sender: {
          userId: sender.id,
          name: sender.name,
          avatar: sender.image,
        },
        replyTo: replyTo || null,
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

  return { messages, typingUsers, onlineCount, send, startTyping, stopTyping };
}
