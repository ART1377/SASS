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
import { LogIn, Mail } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/use-auth';
import { loginSchema, type LoginFormData } from '../validations';

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormData) {
    login(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
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
                    disabled={isLoggingIn}
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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">رمز عبور</FormLabel>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary text-xs transition-colors"
                  >
                    فراموشی رمز؟
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    disabled={isLoggingIn}
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
          isLoading={isLoggingIn}
          icon={LogIn}
          label="ورود به حساب"
          className="shadow-primary/20 hover:shadow-primary/30 h-11 w-full rounded-xl font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
        />

        <p className="text-muted-foreground text-center text-sm">
          حساب کاربری ندارید؟{' '}
          <Link
            href={ROUTES.REGISTER}
            className="text-primary font-medium underline-offset-4 transition-all hover:underline"
          >
            ساخت حساب جدید
          </Link>
        </p>
      </form>
    </Form>
  );
}
