import { z } from 'zod';

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'پیام نمی‌تواند خالی باشد')
    .max(1000, 'پیام نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد')
    .trim(),
});

export type MessageFormData = z.infer<typeof messageSchema>;
