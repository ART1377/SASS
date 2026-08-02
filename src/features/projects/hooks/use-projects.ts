import { useMutationWithToast } from '@/shared/hooks/use-mutation-with-toast';
import { queryKeys } from '@/shared/lib/query-keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { projectsApi } from '../api/projects-api';
import type { UpdateProjectInput } from '../types';

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: projectsApi.getAll,
  });

  const createProjectMutation = useMutationWithToast({
    mutationFn: projectsApi.create,
    queryKey: queryKeys.projects.all,
    successMessage: 'پروژه با موفقیت ایجاد شد',
    errorMessage: 'خطا در ایجاد پروژه',
  });

  const updateProjectMutation = useMutationWithToast({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
      projectsApi.update(id, data),
    queryKey: queryKeys.projects.all,
    successMessage: 'پروژه با موفقیت به‌روزرسانی شد',
    errorMessage: 'خطا در به‌روزرسانی پروژه',
  });

  const deleteProjectMutation = useMutationWithToast({
    mutationFn: projectsApi.delete,
    queryKey: queryKeys.projects.all,
    successMessage: 'پروژه با موفقیت حذف شد',
    errorMessage: 'خطا در حذف پروژه',
  });

  const inviteMemberMutation = useMutation({
    mutationFn: ({ projectId, email }: { projectId: string; email: string }) =>
      projectsApi.inviteMember(projectId, email),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.members(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success('عضو با موفقیت دعوت شد');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error?.response?.data?.error || 'خطا در دعوت عضو');
    },
  });

  return {
    projects: projectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    error: projectsQuery.error,
    createProject: createProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutate,
    isUpdating: updateProjectMutation.isPending,
    deleteProject: deleteProjectMutation.mutate,
    isDeleting: deleteProjectMutation.isPending,
    inviteMember: inviteMemberMutation.mutate,
    isInviting: inviteMemberMutation.isPending,
  };
}
