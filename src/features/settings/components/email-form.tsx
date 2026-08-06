'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { InputWithIcon } from '@/shared/components/ui/input-with-icon';
import { PasswordInput } from '@/shared/components/ui/password-input';
import { SubmitButton } from '@/shared/components/ui/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useChangeEmail } from '../hooks/use-settings';
import { emailFormSchema, type EmailFormData } from '../validations';

interface EmailFormProps {
  currentEmail?: string | null;
}

export function EmailForm({ currentEmail }: EmailFormProps) {
  const changeEmailMutation = useChangeEmail();

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      newEmail: '',
      password: '',
    },
  });

  function onSubmit(data: EmailFormData) {
    changeEmailMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-muted/80 mb-2 rounded-xl p-3">
          <p className="text-muted-foreground text-sm">
            ایمیل فعلی: <span className="text-foreground font-medium">{currentEmail}</span>
          </p>
        </div>

        <FormField
          control={form.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ایمیل جدید</FormLabel>
              <FormControl>
                <InputWithIcon
                  icon={Mail}
                  type="email"
                  placeholder="newemail@example.com"
                  disabled={changeEmailMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رمز عبور (برای تایید)</FormLabel>
              <FormControl>
                <div className="relative">
                  <PasswordInput
                    placeholder="رمز عبور خود را وارد کنید"
                    disabled={changeEmailMutation.isPending}
                    {...field}
                  />
                  <Lock className="text-muted-foreground/50 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isLoading={changeEmailMutation.isPending} icon={Mail} label="تغییر ایمیل" />
        <p className="text-muted-foreground text-xs">
          ⚠️ پس از تغییر ایمیل، باید دوباره وارد حساب کاربری خود شوید
        </p>
      </form>
    </Form>
  );
}
