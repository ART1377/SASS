import { queryKeys } from '@/shared/lib/query-keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { tasksApi } from '../api/tasks-api';
import type { UpdateTaskInput } from '../types';

export function useTasks(projectId?: string) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: projectId ? queryKeys.tasks.byProject(projectId) : queryKeys.tasks.all,
    queryFn: () => tasksApi.getAll(projectId ? { projectId } : undefined),
  });

  const createTaskMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.success('تسک با موفقیت ایجاد شد');
    },
    onError: () => {
      toast.error('خطا در ایجاد تسک');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) => tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.success('تسک به‌روزرسانی شد');
    },
    onError: () => {
      toast.error('خطا در به‌روزرسانی تسک');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.success('تسک حذف شد');
    },
    onError: () => {
      toast.error('خطا در حذف تسک');
    },
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    createTask: createTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutate,
    isUpdating: updateTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutate,
    isDeleting: deleteTaskMutation.isPending,
  };
}
