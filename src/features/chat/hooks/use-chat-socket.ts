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

interface DeleteAck {
  success?: boolean;
  error?: string;
}

interface UpdateAck {
  message?: SocketMessage;
  error?: string;
}

export function useChatSocket(roomId: string) {
  const { socket, isConnected } = useSocket();
  const [liveMessages, setLiveMessages] = useState<SocketMessage[]>([]);
  const [deletedMessageIds, setDeletedMessageIds] = useState<Set<string>>(new Set());
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

    // Broadcast for any deletion in this room, including our own
    const onMessageDeleted = (data: { roomId: string; messageId: string }) => {
      if (data.roomId !== roomId) return;
      setDeletedMessageIds((prev) => {
        if (prev.has(data.messageId)) return prev;
        const next = new Set(prev);
        next.add(data.messageId);
        return next;
      });
    };

    // Listen for real-time message edits
    const onMessageUpdated = (updated: SocketMessage) => {
      setLiveMessages((prev) => prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)));
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
    socket.on('message:deleted', onMessageDeleted);
    socket.on('message:updated', onMessageUpdated);
    socket.on('typing:user_started', onTypingStart);
    socket.on('typing:user_stopped', onTypingStop);
    socket.on('room:online_count', onOnlineCount);

    return () => {
      socket.off('message:new', onMessage);
      socket.off('message:deleted', onMessageDeleted);
      socket.off('message:updated', onMessageUpdated);
      socket.off('typing:user_started', onTypingStart);
      socket.off('typing:user_stopped', onTypingStop);
      socket.off('room:online_count', onOnlineCount);

      socket.emit('room:leave', roomId);
      joinedRef.current = false;
      setLiveMessages([]);
      setDeletedMessageIds(new Set());
      setTypingUsers([]);
      setOnlineCount(0);
    };
  }, [socket, isConnected, roomId]);

  // Sends via the socket (server persists then broadcasts)
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

  const deleteMessage = useCallback(
    (messageId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!socket || !isConnected) {
          reject(new Error('اتصال برقرار نیست'));
          return;
        }
        socket.emit('message:delete', { roomId, messageId }, (ack: DeleteAck) => {
          if (ack?.error) {
            reject(new Error(ack.error));
            return;
          }
          resolve();
        });
      });
    },
    [socket, isConnected, roomId]
  );

  const updateMessage = useCallback(
    (messageId: string, content: string): Promise<SocketMessage> => {
      return new Promise((resolve, reject) => {
        if (!socket || !isConnected) {
          reject(new Error('اتصال برقرار نیست'));
          return;
        }
        socket.emit('message:update', { roomId, messageId, content }, (ack: UpdateAck) => {
          if (ack?.error || !ack?.message) {
            reject(new Error(ack?.error || 'خطا در ویرایش پیام'));
            return;
          }
          resolve(ack.message);
        });
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
    deletedMessageIds,
    typingUsers,
    onlineCount,
    send,
    deleteMessage,
    updateMessage,
    startTyping,
    stopTyping,
    registerUser,
    isConnected,
  };
}
