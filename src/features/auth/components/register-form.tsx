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
import { ROUTES } from '@/shared/lib/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/use-auth';
import { registerSchema, type RegisterFormData } from '../validations';

export function RegisterForm() {
  const { register: registerUser, isRegistering } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: RegisterFormData) {
    registerUser(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">نام کامل</FormLabel>
                <FormControl>
                  <InputWithIcon
                    icon={User}
                    placeholder="علی محمدی"
                    disabled={isRegistering}
                    className="bg-muted/50 focus:bg-background h-11 rounded-xl border-transparent transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">ایمیل</FormLabel>
                <FormControl>
                  <InputWithIcon
                    icon={Mail}
                    type="email"
                    placeholder="example@email.com"
                    disabled={isRegistering}
                    className="bg-muted/50 focus:bg-background h-11 rounded-xl border-transparent transition-all"
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
                <FormLabel className="text-sm font-medium">رمز عبور</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="حداقل ۸ کاراکتر"
                    disabled={isRegistering}
                    className="bg-muted/50 focus:bg-background h-11 border-transparent transition-all"
                    {...field}
                  />
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
                <FormLabel className="text-sm font-medium">تکرار رمز عبور</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="تکرار رمز عبور"
                    disabled={isRegistering}
                    className="bg-muted/50 focus:bg-background h-11 border-transparent transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SubmitButton
          isLoading={isRegistering}
          icon={UserPlus}
          label="ایجاد حساب کاربری"
          className="shadow-primary/20 hover:shadow-primary/30 h-11 w-full rounded-xl font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
        />

        <p className="text-muted-foreground text-center text-sm">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link
            href={ROUTES.LOGIN}
            className="text-primary font-medium underline-offset-4 transition-all hover:underline"
          >
            وارد شوید
          </Link>
        </p>
      </form>
    </Form>
  );
}
