import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { settingsApi } from '../api/settings-api';
import type { EmailFormData, PasswordFormData, ProfileFormData } from '../validations';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileFormData) => settingsApi.updateProfile({ name: data.name }),
    onSuccess: () => {
      toast.success('پروفایل با موفقیت بروزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error?.response?.data?.error || 'خطا در بروزرسانی پروفایل');
    },
  });
}

export function useChangeEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmailFormData) =>
      settingsApi.changeEmail({
        newEmail: data.newEmail,
        password: data.password,
      }),
    onSuccess: () => {
      toast.success('ایمیل با موفقیت تغییر کرد. لطفاً دوباره وارد شوید');
      queryClient.clear();
      // Sign out after email change
      setTimeout(() => {
        signOut({ callbackUrl: '/login' });
      }, 2000);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error?.response?.data?.error || 'خطا در تغییر ایمیل');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordFormData) =>
      settingsApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success('رمز عبور با موفقیت تغییر کرد');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error?.response?.data?.error || 'خطا در تغییر رمز عبور');
    },
  });
}
