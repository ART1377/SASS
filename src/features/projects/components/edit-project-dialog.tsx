'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderKanban, Loader2, Pencil } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProjects } from '../hooks/use-projects';
import type { Project } from '../types';
import { createProjectSchema, type CreateProjectFormData } from '../validations';

interface EditProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
  const { updateProject, isUpdating } = useProjects();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || '',
    },
  });

  // Update form values when project changes
  useEffect(() => {
    form.reset({
      name: project.name,
      description: project.description || '',
    });
  }, [project, form]);

  function onSubmit(data: CreateProjectFormData) {
    updateProject(
      { id: project.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-107">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <FolderKanban className="text-primary h-5 w-5" />
            </div>
            <div>
              <DialogTitle>ویرایش پروژه</DialogTitle>
              <DialogDescription>اطلاعات پروژه را ویرایش کنید</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام پروژه</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: وبسایت فروشگاهی" disabled={isUpdating} {...field} />
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
                      disabled={isUpdating}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <Pencil className="ml-2 h-4 w-4" />
                )}
                ذخیره تغییرات
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
