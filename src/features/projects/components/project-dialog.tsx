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
import { FolderKanban, Pencil, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProjects } from '../hooks/use-projects';
import type { Project } from '../types';
import { createProjectSchema, type CreateProjectFormData } from '../validations';

interface ProjectDialogProps {
  project?: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function ProjectDialog({ project, open, onOpenChange, trigger }: ProjectDialogProps) {
  const { createProject, isCreating, updateProject, isUpdating } = useProjects();
  const isEditing = !!project;
  const isLoading = isEditing ? isUpdating : isCreating;

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project?.name ?? '',
      description: project?.description ?? '',
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || '',
      });
    }
  }, [project, form]);

  function onSubmit(data: CreateProjectFormData) {
    if (isEditing) {
      updateProject({ id: project!.id, data }, { onSuccess: () => onOpenChange(false) });
    } else {
      createProject(data, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-125">
        <DialogHeaderWithIcon
          icon={isEditing ? Pencil : FolderKanban}
          title={isEditing ? 'ویرایش پروژه' : 'ایجاد پروژه جدید'}
          description={
            isEditing ? 'اطلاعات پروژه را ویرایش کنید' : 'یک پروژه جدید برای تیم خود بسازید'
          }
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
                    <Input placeholder="مثال: وبسایت فروشگاهی" disabled={isLoading} {...field} />
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
                      placeholder="توضیح کوتاه..."
                      disabled={isLoading}
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
              <SubmitButton
                isLoading={isLoading}
                icon={isEditing ? Pencil : Plus}
                label={isEditing ? 'ذخیره تغییرات' : 'ایجاد پروژه'}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
