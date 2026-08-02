import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface MutationOptions<TData, TVariables = void> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey?: QueryKey;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

export function useMutationWithToast<TData = unknown, TVariables = void>({
  mutationFn,
  queryKey,
  successMessage,
  errorMessage = 'خطا در انجام عملیات',
  onSuccess,
  onError,
}: MutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
      if (successMessage) {
        toast.success(successMessage);
      }
      onSuccess?.(data, variables);
    },
    onError: (error: Error, variables) => {
      toast.error(errorMessage);
      onError?.(error, variables);
    },
  });
}
