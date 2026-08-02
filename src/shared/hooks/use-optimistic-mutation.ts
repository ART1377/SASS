import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface OptimisticUpdateConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: QueryKey;
  successMessage?: string;
  errorMessage?: string;

  // Update function: gets current cache + variables, returns new cache
  onOptimisticUpdate?: (oldData: TData[] | undefined, variables: TVariables) => TData[];
}

export function useOptimisticMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  queryKey,
  successMessage,
  errorMessage = 'خطا در انجام عملیات',
  onOptimisticUpdate,
}: OptimisticUpdateConfig<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<TData[]>(queryKey);

      if (onOptimisticUpdate) {
        queryClient.setQueryData<TData[]>(queryKey, (old) => onOptimisticUpdate(old, variables));
      }

      return { previousData };
    },

    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(errorMessage);
    },

    onSuccess: () => {
      if (successMessage) {
        toast.success(successMessage);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
