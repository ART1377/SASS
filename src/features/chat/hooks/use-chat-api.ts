import { queryKeys } from '@/shared/lib/query-keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat-api';

export function useChatAPI(roomId: string) {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: queryKeys.chat.messages(roomId),
    queryFn: () => chatApi.getMessages(roomId),
    staleTime: 5 * 60 * 1000,
  });

  const sendMutation = useMutation({
    mutationFn: ({ content, replyToId }: { content: string; replyToId?: string }) =>
      chatApi.sendMessage(roomId, content, replyToId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(roomId) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => chatApi.deleteMessage(roomId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(roomId) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      chatApi.updateMessage(roomId, messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(roomId) });
    },
  });

  return {
    messages: messagesQuery.data ?? [],
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    sendToAPI: (content: string, replyToId?: string) => sendMutation.mutate({ content, replyToId }),
    isSending: sendMutation.isPending,
    refetch: messagesQuery.refetch,
    deleteMessage: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    updateMessage: (messageId: string, content: string) =>
      updateMutation.mutate({ messageId, content }),
    isUpdating: updateMutation.isPending,
  };
}
