import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pushGlobalToast } from '@/lib/toast';
import {
  fetchDashboardSummary,
  type DashboardSummary,
} from './dashboardApi';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: fetchDashboardSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useInvalidateDashboardSummary = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({
      queryKey: ['dashboard', 'summary'],
    });
  };
};
