import { queryKeys } from '@/shared/lib/query-keys';
import { ROUTES } from '@/shared/lib/routes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth-api';
import type { LoginInput } from '../types';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: queryKeys.users.profile,
    queryFn: authApi.getProfile,
    enabled: status === 'authenticated',
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success('خوش آمدید!');
      router.push(ROUTES.DASHBOARD);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'ورود ناموفق بود');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      await signIn('credentials', {
        email: data.user.email,
        password: '', // This will be handled by the session
        redirect: false,
      });
      toast.success('ثبت‌نام با موفقیت انجام شد');
      router.push(ROUTES.DASHBOARD);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'ثبت‌نام ناموفق بود');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
      router.push(ROUTES.LOGIN);
    },
    onSuccess: () => {
      toast.success('با موفقیت خارج شدید');
      queryClient.clear();
    },
  });

  return {
    user: profile ?? session?.user,
    isLoading: status === 'loading' || isProfileLoading,
    isAuthenticated: status === 'authenticated',
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
