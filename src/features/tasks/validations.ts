import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'عنوان تسک الزامی است')
    .min(3, 'عنوان باید حداقل ۳ کاراکتر باشد')
    .max(200, 'عنوان نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد'),
  description: z.string().max(1000, 'توضیحات نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  projectId: z.string().min(1, 'پروژه الزامی است'),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
