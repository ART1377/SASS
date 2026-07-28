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
    mutationFn: (content: string) => chatApi.sendMessage(roomId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(roomId) });
    },
  });

  return {
    messages: messagesQuery.data ?? [],
    isLoading: messagesQuery.isLoading,
    sendToAPI: sendMutation.mutate,
    isSending: sendMutation.isPending,
  };
}
