import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'ایمیل الزامی است').email('ایمیل نامعتبر است'),
  password: z.string().min(1, 'رمز عبور الزامی است').min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, 'نام الزامی است').min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
    email: z.string().min(1, 'ایمیل الزامی است').email('ایمیل نامعتبر است'),
    password: z
      .string()
      .min(1, 'رمز عبور الزامی است')
      .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد'),
    confirmPassword: z.string().min(1, 'تکرار رمز عبور الزامی است'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'رمز عبور و تکرار آن مطابقت ندارند',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
