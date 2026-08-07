import { queryKeys } from '@/shared/lib/query-keys';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { chatApi } from '../api/chat-api';
import { MESSAGES_PAGE_SIZE } from '../constants';
import type { ChatMessage } from '../types';

export function useChatAPI(roomId: string) {
  const queryClient = useQueryClient();
  const messagesQueryKey = queryKeys.chat.messages(roomId);

  const messagesQuery = useInfiniteQuery({
    queryKey: messagesQueryKey,
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      chatApi.getMessages(roomId, pageParam, MESSAGES_PAGE_SIZE),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes (formerly cacheTime)
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!roomId,
  });

  // Remove old cached data for this room when roomId changes
  const previousRoomIdRef = useRef(roomId);
  useEffect(() => {
    if (roomId !== previousRoomIdRef.current) {
      // Clear the old room's cache completely
      if (previousRoomIdRef.current) {
        queryClient.removeQueries({
          queryKey: queryKeys.chat.messages(previousRoomIdRef.current),
        });
      }
      previousRoomIdRef.current = roomId;
    }
  }, [roomId, queryClient]);

  const messages = useMemo<ChatMessage[]>(() => {
    if (!messagesQuery.data) return [];
    return [...messagesQuery.data.pages].reverse().flatMap((page) => page.messages);
  }, [messagesQuery.data]);

  // ── Optimistic Delete ──────────────────────
  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => chatApi.deleteMessage(roomId, messageId),
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: messagesQueryKey });
      const previousData = queryClient.getQueryData(messagesQueryKey);

      queryClient.setQueryData(messagesQueryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.filter((m: ChatMessage) => m.id !== messageId),
          })),
        };
      });

      return { previousData };
    },
    onError: (_err, _messageId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(messagesQueryKey, context.previousData);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      chatApi.updateMessage(roomId, messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesQueryKey });
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
    deleteMessageAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateMessage: (messageId: string, content: string) =>
      updateMutation.mutate({ messageId, content }),
    isUpdating: updateMutation.isPending,
  };
}
