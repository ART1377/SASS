'use client';

import { useProjects } from '@/features/projects/hooks/use-projects';
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
import { PersianDatePicker } from '@/shared/components/ui/persian-date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { SubmitButton } from '@/shared/components/ui/submit-button';
import { Textarea } from '@/shared/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Pencil, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProjectMembers } from '../hooks/use-project-members';
import { useTasks } from '../hooks/use-tasks';
import type { Task } from '../types';
import { createTaskSchema, type CreateTaskFormData } from '../validations';

interface TaskDialogProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function TaskDialog({ task, open, onOpenChange, trigger }: TaskDialogProps) {
  const { createTask, isCreating, updateTask, isUpdating } = useTasks();
  const { projects } = useProjects();

  const isEditing = !!task;
  const isLoading = isEditing ? isUpdating : isCreating;

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 'MEDIUM',
      projectId: task?.projectId ?? '',
      assigneeId: task?.assigneeId ?? '',
      dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    },
  });

  const selectedProjectId = form.watch('projectId');
  const { data: members = [] } = useProjectMembers(selectedProjectId || undefined);

  // Reset form when editing a different task
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        projectId: task.projectId,
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
  }, [task, form]);

  function onSubmit(data: CreateTaskFormData) {
    if (isEditing) {
      updateTask({ id: task!.id, data }, { onSuccess: () => onOpenChange(false) });
    } else {
      createTask(data, {
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

      <DialogContent className="sm:max-w-140">
        <DialogHeaderWithIcon
          icon={isEditing ? Pencil : CheckSquare}
          title={isEditing ? 'ویرایش تسک' : 'ایجاد تسک جدید'}
          description={isEditing ? 'اطلاعات تسک را ویرایش کنید' : 'تسک جدید به برد اضافه کنید'}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
            {/* Row 1: Project + Assignee (half each) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>پروژه</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="انتخاب پروژه" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.length === 0 ? (
                          <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                            ابتدا یک پروژه بسازید
                          </div>
                        ) : (
                          projects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
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
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>واگذار به</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={!selectedProjectId}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="انتخاب عضو" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.length === 0 ? (
                          <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                            عضوی یافت نشد
                          </div>
                        ) : (
                          members.map((m) => (
                            <SelectItem key={m.user.id} value={m.user.id}>
                              {m.user.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Title (full width) */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان تسک</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: طراحی صفحه اصلی" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 3: Description (full width) */}
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

            {/* Row 4: Priority + Due Date (half each) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اولویت</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
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
                      <PersianDatePicker
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                انصراف
              </Button>
              <SubmitButton
                isLoading={isLoading}
                icon={isEditing ? Pencil : Plus}
                label={isEditing ? 'ذخیره تغییرات' : 'ایجاد تسک'}
                disabled={!selectedProjectId}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
