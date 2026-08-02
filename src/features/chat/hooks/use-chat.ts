import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMutationWithToast } from '@/shared/hooks/use-mutation-with-toast';
import { queryKeys } from '@/shared/lib/query-keys';
import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chat-api';
import { useChatAPI } from './use-chat-api';
import { useChatSocket } from './use-chat-socket';

// ─── Main Chat Hook ─────────────────────────────
export function useChat(roomId: string) {
  const { user } = useAuth();
  const api = useChatAPI(roomId);
  const socket = useChatSocket(roomId);

  // ✅ Filter out own messages from socket
  const socketMessagesFromOthers = socket.messages.filter((m) => m.senderId !== user?.id);

  // Combine API + Socket (others only)
  const allMessages = [...api.messages, ...socketMessagesFromOthers].sort(
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
    isError: api.isError,
    sendMessage,
    isSending: api.isSending,
    typingUsers: othersTyping,
    startTyping: socket.startTyping,
    stopTyping: socket.stopTyping,
    currentUser: user,
    refetch: api.refetch,
    onlineCount: socket.onlineCount,
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
  return useMutationWithToast({
    mutationFn: ({ projectId, name }: { projectId: string; name: string }) =>
      chatApi.createRoom(projectId, name),
    queryKey: ['chat'],
    successMessage: 'چت روم با موفقیت ایجاد شد',
    errorMessage: 'خطا در ایجاد چت روم',
  });
}
