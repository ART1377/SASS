import { z } from 'zod';

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, 'نام الزامی است')
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(100, 'نام نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),
  email: z.string().email().optional(),
});

export const emailFormSchema = z.object({
  newEmail: z
    .string()
    .min(1, 'ایمیل جدید الزامی است')
    .email('ایمیل نامعتبر است')
    .max(255, 'ایمیل نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),
  password: z.string().min(1, 'رمز عبور برای تایید الزامی است'),
});

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'رمز عبور فعلی الزامی است'),
    newPassword: z
      .string()
      .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد'),
    confirmPassword: z.string().min(1, 'تکرار رمز عبور الزامی است'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'رمز عبور و تکرار آن مطابقت ندارند',
    path: ['confirmPassword'],
  });

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type EmailFormData = z.infer<typeof emailFormSchema>;
export type PasswordFormData = z.infer<typeof passwordFormSchema>;
