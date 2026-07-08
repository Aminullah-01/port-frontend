import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/endpoints';
import type { DashboardData } from '@/types/api';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.get(),
    staleTime: 30_000,
  });
}
