'use client';

import { useMutationWithToast } from '@/shared/hooks/use-mutation-with-toast';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api/projects-api';
import type { UpdateProjectInput } from '../types';

interface UseProjectsFilters {
  q?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useProjects(filters: UseProjectsFilters = {}) {
  const projectsQuery = useQuery({
    queryKey: ['projects', { ...filters }], // cache per filter combination
    queryFn: () => projectsApi.getAll(filters),
  });

  const createProjectMutation = useMutationWithToast({
    mutationFn: projectsApi.create,
    queryKey: ['projects'], // broad invalidation – clears all cached projects lists
    successMessage: 'پروژه با موفقیت ایجاد شد',
    errorMessage: 'خطا در ایجاد پروژه',
  });

  const updateProjectMutation = useMutationWithToast({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
      projectsApi.update(id, data),
    queryKey: ['projects'],
    successMessage: 'پروژه با موفقیت به‌روزرسانی شد',
    errorMessage: 'خطا در به‌روزرسانی پروژه',
  });

  const deleteProjectMutation = useMutationWithToast({
    mutationFn: projectsApi.delete,
    queryKey: ['projects'],
    successMessage: 'پروژه با موفقیت حذف شد',
    errorMessage: 'خطا در حذف پروژه',
  });

  const inviteMemberMutation = useMutationWithToast({
    mutationFn: ({ projectId, email }: { projectId: string; email: string }) =>
      projectsApi.inviteMember(projectId, email),
    queryKey: ['projects'],
    successMessage: 'عضو با موفقیت دعوت شد',
    errorMessage: 'خطا در دعوت عضو',
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
