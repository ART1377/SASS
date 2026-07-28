import { queryKeys } from '@/shared/lib/query-keys';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard-api';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardApi.getStats,
    staleTime: 60 * 1000, // 1 minute cache
    refetchInterval: 120 * 1000, // Refetch every 2 minutes
  });
}
