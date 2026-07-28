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
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Save, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useUpdateProfile } from '../hooks/use-settings';
import { profileFormSchema, type ProfileFormData } from '../validations';

interface ProfileFormProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const updateProfileMutation = useUpdateProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  function onSubmit(data: ProfileFormData) {
    updateProfileMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام کامل</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input placeholder="نام خود را وارد کنید" {...field} className="pr-10" />
                  <User className="text-muted-foreground/50 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
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
              <FormLabel>ایمیل</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} disabled className="pr-10 opacity-60" />
                  <Mail className="text-muted-foreground/50 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updateProfileMutation.isPending} className="gap-2">
          {updateProfileMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          ذخیره تغییرات
        </Button>
      </form>
    </Form>
  );
}
