import { z } from 'zod';
import { MAX_MESSAGE_LENGTH } from './constants';

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'پیام نمی‌تواند خالی باشد')
    .max(MAX_MESSAGE_LENGTH, `پیام نمی‌تواند بیشتر از ${MAX_MESSAGE_LENGTH} کاراکتر باشد`)
    .trim(),
});

export type MessageFormData = z.infer<typeof messageSchema>;
