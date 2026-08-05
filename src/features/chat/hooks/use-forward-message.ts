'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useSocket } from '@/shared/providers/socket-provider';
import { useCallback } from 'react';
import type { ChatMessage, SocketMessage } from '../types';

interface ForwardAck {
  message?: SocketMessage;
  error?: string;
}

/**
 * Forwards a message to a different room via the socket, preserving the
 * original content unmodified and carrying the original sender's name as
 * `forwardedFromName` so the UI can show a Telegram-style "Forwarded from"
 * label instead of mutating the text.
 */
export function useForwardMessage() {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  const forwardMessage = useCallback(
    (targetRoomId: string, message: ChatMessage): Promise<SocketMessage> => {
      return new Promise((resolve, reject) => {
        if (!socket || !isConnected || !user) {
          reject(new Error('اتصال برقرار نیست'));
          return;
        }
        socket.emit(
          'message:send',
          {
            roomId: targetRoomId,
            content: message.content,
            sender: { userId: user.id, name: user.name || '', avatar: user.image || null },
            forwardedFromName: message.sender.name,
          },
          (ack: ForwardAck) => {
            if (ack?.error || !ack?.message) {
              reject(new Error(ack?.error || 'خطا در ارسال پیام'));
              return;
            }
            resolve(ack.message);
          }
        );
      });
    },
    [socket, isConnected, user]
  );

  return { forwardMessage };
}
