'use client';

import { useMutationWithToast } from '@/shared/hooks/use-mutation-with-toast';
import { queryKeys } from '@/shared/lib/query-keys';
import { signOut } from 'next-auth/react';
import { settingsApi } from '../api/settings-api';
import type { EmailFormData, PasswordFormData, ProfileFormData } from '../validations';

export function useUpdateProfile() {
  return useMutationWithToast({
    mutationFn: (data: ProfileFormData) => settingsApi.updateProfile({ name: data.name }),
    queryKey: queryKeys.users.profile, // ✅ shared key
    successMessage: 'پروفایل با موفقیت بروزرسانی شد',
    errorMessage: 'خطا در بروزرسانی پروفایل',
  });
}

export function useChangeEmail() {
  return useMutationWithToast({
    mutationFn: (data: EmailFormData) =>
      settingsApi.changeEmail({
        newEmail: data.newEmail,
        password: data.password,
      }),
    successMessage: 'ایمیل با موفقیت تغییر کرد. لطفاً دوباره وارد شوید',
    errorMessage: 'خطا در تغییر ایمیل',
    onSuccess: () => {
      // Sign out after email change
      setTimeout(() => {
        signOut({ callbackUrl: '/login' });
      }, 2000);
    },
  });
}

export function useChangePassword() {
  return useMutationWithToast({
    mutationFn: (data: PasswordFormData) =>
      settingsApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    successMessage: 'رمز عبور با موفقیت تغییر کرد',
    errorMessage: 'خطا در تغییر رمز عبور',
  });
}
