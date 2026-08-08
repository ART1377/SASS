'use client';

import { useMutationWithToast } from '@/shared/hooks/use-mutation-with-toast';
import { projectsApi } from '../api/projects-api';

export function useUpdateMemberRole(projectId: string) {
  return useMutationWithToast({
    mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
      projectsApi.updateRole(projectId, memberId, role),
    queryKey: ['projects'],
    successMessage: 'نقش کاربر تغییر کرد',
    errorMessage: 'خطا در تغییر نقش',
  });
}

export function useRemoveMember(projectId: string) {
  return useMutationWithToast({
    mutationFn: (memberId: string) => projectsApi.removeMember(projectId, memberId),
    queryKey: ['projects'],
    successMessage: 'عضو حذف شد',
    errorMessage: 'خطا در حذف عضو',
  });
}
