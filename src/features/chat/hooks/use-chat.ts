'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMutationWithToast } from '@/shared/hooks/use-mutation-with-toast';
import { queryKeys } from '@/shared/lib/query-keys';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { chatApi } from '../api/chat-api';
import type { ChatMessage, ReplyInfo } from '../types';
import { useChatAPI } from './use-chat-api';
import { useChatSocket } from './use-chat-socket';

// ─── Main Chat Hook ─────────────────────────────
export function useChat(roomId: string) {
  const { user } = useAuth();
  const api = useChatAPI(roomId);
  const socket = useChatSocket(roomId);

  // Merge & deduplicate messages
  const messages = useMemo(() => {
    const apiIds = new Set(api.messages.map((m: ChatMessage) => m.id));
    const socketMessages = socket.messages.filter(
      (m) => !apiIds.has(m.id) && m.senderId !== user?.id
    );

    return [...api.messages, ...socketMessages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [api.messages, socket.messages, user?.id]);

  // Filter typing users
  const othersTyping = useMemo(
    () => socket.typingUsers.filter((u) => u.userId !== user?.id),
    [socket.typingUsers, user?.id]
  );

  const sendMessage = (content: string, replyTo?: ReplyInfo) => {
    if (!content.trim() || !user) return;

    socket.send(
      content,
      {
        id: user.id as string,
        name: user.name || '',
        image: user.image || null,
      },
      replyTo
    );

    api.sendToAPI(content, replyTo?.id);
  };

  return {
    messages,
    isLoading: api.isLoading,
    isError: api.isError,
    sendMessage,
    isSending: api.isSending,
    typingUsers: othersTyping,
    startTyping: socket.startTyping,
    stopTyping: socket.stopTyping,
    currentUser: user,
    refetch: api.refetch,
    onlineCount: socket.onlineCount,
    deleteMessage: api.deleteMessage,
    updateMessage: api.updateMessage,
  };
}

// ─── Chat Rooms Hook ────────────────────────────
export function useChatRooms(projectId?: string) {
  return useQuery({
    queryKey: queryKeys.chat.rooms(projectId || 'all'),
    queryFn: () => chatApi.getRooms(projectId),
    staleTime: 60 * 1000,
  });
}

// ─── Create Chat Room Hook ──────────────────────
export function useCreateChatRoom() {
  return useMutationWithToast({
    mutationFn: ({ projectId, name }: { projectId: string; name: string }) =>
      chatApi.createRoom(projectId, name),
    queryKey: ['chat'],
    successMessage: 'چت روم با موفقیت ایجاد شد',
    errorMessage: 'خطا در ایجاد چت روم',
  });
}
