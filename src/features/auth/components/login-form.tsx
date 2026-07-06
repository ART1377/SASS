'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { ROUTES } from '@/shared/lib/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn } from 'lucide-react';
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ایمیل</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  disabled={isLoggingIn}
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
              <FormLabel>رمز عبور</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" disabled={isLoggingIn} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoggingIn}>
          {isLoggingIn ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="ml-2 h-4 w-4" />
          )}
          ورود
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          حساب کاربری ندارید؟{' '}
          <Link href={ROUTES.REGISTER} className="text-primary hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      </form>
    </Form>
  );
}
