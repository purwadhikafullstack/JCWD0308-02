import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const ResetPasswordSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).max(512),
    confirmPassword: z.string().min(8).max(512),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'Passwords must match!',
      path: ['confirmPassword'],
    },
  );

export const useResetPassword = (
  defaultValues: z.input<typeof ResetPasswordSchema>,
) =>
  useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: 'all',
    defaultValues,
  });