'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCallback } from 'react';
import { chatApi } from '../api/chat-api';
import type { ChatMessage } from '../types';

export function useForwardMessage() {
  const { user } = useAuth();

  const forwardMessage = useCallback(
    async (targetRoomId: string, message: ChatMessage): Promise<ChatMessage> => {
      if (!user) throw new Error('کاربر وارد نشده است');

      // Send via REST API with forwardedFromName
      const response = await chatApi.sendMessage(
        targetRoomId,
        message.content,
        undefined, // no replyTo for forwarded messages
        message.sender.name // forwardedFromName
      );

      return response;
    },
    [user]
  );

  return { forwardMessage };
}
