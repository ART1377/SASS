import { apiClient } from '@/shared/config/axios';
import type { Notification } from '../types';

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const notificationsApi = {
  getAll: async (): Promise<NotificationsResponse> => {
    const response = await apiClient.get<NotificationsResponse>('/notifications');
    return response.data;
  },

  markAsRead: async (ids: string[]): Promise<void> => {
    await apiClient.patch('/notifications', { ids });
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications', { markAll: true });
  },
};
