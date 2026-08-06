'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { PasswordInput } from '@/shared/components/ui/password-input';
import { SubmitButton } from '@/shared/components/ui/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useChangePassword } from '../hooks/use-settings';
import { passwordFormSchema, type PasswordFormData } from '../validations';

export function PasswordForm() {
  const changePasswordMutation = useChangePassword();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: PasswordFormData) {
    changePasswordMutation.mutate(data, {
      onSuccess: () => form.reset(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رمز عبور فعلی</FormLabel>
              <FormControl>
                <div className="relative">
                  <PasswordInput placeholder="••••••••" {...field} />
                  <Lock className="text-muted-foreground/60 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رمز عبور جدید</FormLabel>
              <FormControl>
                <div className="relative">
                  <PasswordInput placeholder="حداقل ۸ کاراکتر" {...field} />
                  <KeyRound className="text-muted-foreground/60 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تکرار رمز عبور جدید</FormLabel>
              <FormControl>
                <PasswordInput placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          isLoading={changePasswordMutation.isPending}
          icon={KeyRound}
          label="تغییر رمز عبور"
        />
      </form>
    </Form>
  );
}
