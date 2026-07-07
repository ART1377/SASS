'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/use-auth';
import { registerSchema, type RegisterFormData } from '../validations';
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
import { PasswordInput } from '@/shared/components/ui/password-input';
import { Loader2, UserPlus, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/shared/lib/routes';

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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">نام کامل</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="علی محمدی"
                    disabled={isRegistering}
                    className="pr-10"
                    {...field}
                  />
                  <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                </div>
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
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    disabled={isRegistering}
                    className="pr-10"
                    {...field}
                  />
                  <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                </div>
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
                <PasswordInput placeholder="••••••••" disabled={isRegistering} {...field} />
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
                <PasswordInput placeholder="••••••••" disabled={isRegistering} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary/90 hover:bg-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
          disabled={isRegistering}
        >
          {isRegistering ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="ml-2 h-4 w-4" />
          )}
          ثبت‌نام
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link
            href={ROUTES.LOGIN}
            className="text-primary hover:underline font-medium transition-colors"
          >
            وارد شوید
          </Link>
        </p>
      </form>
    </Form>
  );
}