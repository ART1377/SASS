import { queryKeys } from '@/shared/lib/query-keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success('همه اعلان‌ها خوانده شدند');
    },
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
