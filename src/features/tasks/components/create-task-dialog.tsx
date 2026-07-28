'use client';

import { useProjects } from '@/features/projects/hooks/use-projects';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTasks } from '../hooks/use-tasks';
import { createTaskSchema, type CreateTaskFormData } from '../validations';

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const { createTask, isCreating } = useTasks();
  const { projects } = useProjects();

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      projectId: '',
      assigneeId: '',
      dueDate: '',
    },
  });

  function onSubmit(data: CreateTaskFormData) {
    createTask(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-primary/20 gap-2 shadow-lg">
          <Plus className="h-4 w-4" />
          تسک جدید
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <CheckSquare className="text-primary h-5 w-5" />
            </div>
            <div>
              <DialogTitle>ایجاد تسک جدید</DialogTitle>
              <DialogDescription>تسک جدید به برد اضافه کنید</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            {/* Project Select - اضافه شد */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>پروژه</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="انتخاب پروژه" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.length === 0 ? (
                        <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                          ابتدا یک پروژه بسازید
                        </div>
                      ) : (
                        projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان تسک</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: طراحی صفحه اصلی" disabled={isCreating} {...field} />
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
                      disabled={isCreating}
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اولویت</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">کم</SelectItem>
                        <SelectItem value="MEDIUM">متوسط</SelectItem>
                        <SelectItem value="HIGH">زیاد</SelectItem>
                        <SelectItem value="URGENT">فوری</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>موعد تحویل</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isCreating}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={isCreating || projects.length === 0}>
                {isCreating ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
                ایجاد تسک
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
