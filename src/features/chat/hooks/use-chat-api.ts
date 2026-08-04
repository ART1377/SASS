import { queryKeys } from '@/shared/lib/query-keys';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { chatApi } from '../api/chat-api';
import { MESSAGES_PAGE_SIZE } from '../constants';
import type { ChatMessage } from '../types';

export function useChatAPI(roomId: string) {
  const queryClient = useQueryClient();

  const messagesQuery = useInfiniteQuery({
    queryKey: queryKeys.chat.messages(roomId),
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      chatApi.getMessages(roomId, pageParam, MESSAGES_PAGE_SIZE),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // Messages arrive live via the socket; there's no need to treat the REST
    // snapshot as stale and silently refetch it out from under the user.
    staleTime: Infinity,
  });

  // Pages are fetched newest-first (each page = one page of older messages),
  // so flatten in reverse and keep each page's internal chronological order.
  const messages = useMemo<ChatMessage[]>(() => {
    if (!messagesQuery.data) return [];
    return [...messagesQuery.data.pages].reverse().flatMap((page) => page.messages);
  }, [messagesQuery.data]);

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
    messages,
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    refetch: messagesQuery.refetch,
    hasOlderMessages: messagesQuery.hasNextPage,
    isLoadingOlder: messagesQuery.isFetchingNextPage,
    loadOlderMessages: messagesQuery.fetchNextPage,
    deleteMessage: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    updateMessage: (messageId: string, content: string) =>
      updateMutation.mutate({ messageId, content }),
    isUpdating: updateMutation.isPending,
  };
}
