'use client';

import { DialogHeaderWithIcon } from '@/shared/components/dialog-header-with-icon';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { SubmitButton } from '@/shared/components/ui/submit-button';
import { Textarea } from '@/shared/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderKanban, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProjects } from '../hooks/use-projects';
import { createProjectSchema, type CreateProjectFormData } from '../validations';

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const { createProject, isCreating } = useProjects();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  function onSubmit(data: CreateProjectFormData) {
    createProject(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-primary/20 hover:shadow-primary/30 gap-2 shadow-lg transition-all duration-300 hover:shadow-xl">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">پروژه جدید</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeaderWithIcon
          icon={FolderKanban}
          title="ایجاد پروژه جدید"
          description="یک پروژه جدید برای تیم خود بسازید"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام پروژه</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: وبسایت فروشگاهی" disabled={isCreating} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="توضیح کوتاهی درباره پروژه..."
                      disabled={isCreating}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                انصراف
              </Button>
              <SubmitButton isLoading={isCreating} icon={Plus} label="ایجاد پروژه" />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
