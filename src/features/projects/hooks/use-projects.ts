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

  const createProjectMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success('پروژه با موفقیت ایجاد شد');
    },
    onError: () => {
      toast.error('خطا در ایجاد پروژه');
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success('پروژه با موفقیت به‌روزرسانی شد');
    },
    onError: () => {
      toast.error('خطا در به‌روزرسانی پروژه');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success('پروژه با موفقیت حذف شد');
    },
    onError: () => {
      toast.error('خطا در حذف پروژه');
    },
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
