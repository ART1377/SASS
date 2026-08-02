import { useMutationWithToast } from '@/shared/hooks/use-mutation-with-toast';
import { queryKeys } from '@/shared/lib/query-keys';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications-api';

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: notificationsApi.getAll,
    staleTime: 5 * 60 * 1000,
    refetchInterval: false,
    refetchOnWindowFocus: true,
  });

  const markAsReadMutation = useMutationWithToast({
    mutationFn: notificationsApi.markAsRead,
    queryKey: queryKeys.notifications.all,
  });

  const markAllAsReadMutation = useMutationWithToast({
    mutationFn: notificationsApi.markAllAsRead,
    queryKey: queryKeys.notifications.all,
    successMessage: 'همه اعلان‌ها خوانده شدند',
  });

  return {
    notifications: notificationsQuery.data?.notifications ?? [],
    unreadCount: notificationsQuery.data?.unreadCount ?? 0,
    isLoading: notificationsQuery.isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAll: markAllAsReadMutation.isPending,
  };
}
