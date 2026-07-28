import { useAuth } from '@/features/auth/hooks/use-auth';
import { queryKeys } from '@/shared/lib/query-keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { chatApi } from '../api/chat-api';
import type { ChatMessage } from '../types';
import { useChatAPI } from './use-chat-api';
import { useChatSocket } from './use-chat-socket';

// ─── Main Chat Hook ─────────────────────────────
export function useChat(roomId: string) {
  const { user } = useAuth();
  const api = useChatAPI(roomId);
  const socket = useChatSocket(roomId);

  // Deduplicate: API messages (real IDs) + Socket messages from others (temp IDs)
  const apiIds = new Set(api.messages.map((m: ChatMessage) => m.id));
  const socketMessages = socket.messages.filter((m) => !apiIds.has(m.id));

  const allMessages = [...api.messages, ...socketMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Filter out current user from typing
  const othersTyping = socket.typingUsers.filter((u) => u.userId !== user?.id);

  const sendMessage = (content: string) => {
    if (!content.trim() || !user) return;
    socket.send(content, {
      id: user.id as string,
      name: user.name || '',
      image: user.image || null,
    });
    api.sendToAPI(content);
  };

  return {
    messages: allMessages,
    isLoading: api.isLoading,
    sendMessage,
    isSending: api.isSending,
    typingUsers: othersTyping,
    startTyping: socket.startTyping,
    stopTyping: socket.stopTyping,
    currentUser: user,
  };
}

// ─── Chat Rooms Hook ────────────────────────────
export function useChatRooms(projectId?: string) {
  const query = useQuery({
    queryKey: queryKeys.chat.rooms(projectId || 'all'),
    queryFn: () => chatApi.getRooms(projectId),
    staleTime: 60 * 1000,
  });

  return {
    rooms: query.data ?? [],
    isLoading: query.isLoading,
  };
}

// ─── Create Chat Room Hook ──────────────────────
export function useCreateChatRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, name }: { projectId: string; name: string }) =>
      chatApi.createRoom(projectId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat'] });
      toast.success('چت روم با موفقیت ایجاد شد');
    },
    onError: () => {
      toast.error('خطا در ایجاد چت روم');
    },
  });
}
