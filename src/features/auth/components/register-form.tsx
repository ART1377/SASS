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
import { PasswordInput } from '@/shared/components/ui/password-input';
import { ROUTES } from '@/shared/lib/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, User, UserPlus } from 'lucide-react';
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
                  <div className="relative">
                    <Input
                      placeholder="علی محمدی"
                      disabled={isRegistering}
                      className="bg-muted/50 focus:bg-background h-11 rounded-xl border-transparent pr-10 transition-all"
                      {...field}
                    />
                    <User className="text-muted-foreground/60 absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2" />
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
                      className="bg-muted/50 focus:bg-background h-11 rounded-xl border-transparent pr-10 transition-all"
                      {...field}
                    />
                    <Mail className="text-muted-foreground/60 absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2" />
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

        <Button
          type="submit"
          className="shadow-primary/20 hover:shadow-primary/30 h-11 w-full rounded-xl font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
          disabled={isRegistering}
        >
          {isRegistering ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="ml-2 h-4 w-4" />
              ایجاد حساب کاربری
            </>
          )}
        </Button>

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
