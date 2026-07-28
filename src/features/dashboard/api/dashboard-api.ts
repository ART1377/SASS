import { apiClient } from '@/shared/config/axios';
import type { DashboardStats } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
