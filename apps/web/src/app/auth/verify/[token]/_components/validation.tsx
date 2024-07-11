import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const VerifyFormSchema = z
  .object({
    email: z.string().email().optional(),
    displayName: z.string().min(5).max(32),
    password: z.string().min(8).max(512),
    confirmPassword: z.string().min(8).max(512),
    registerCode: z
      .union([z.string().length(0), z.string().min(8)])
      .optional()
      .transform((e) => (e === '' ? undefined : e)),
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

export const useVerifyForm = (
  defaultValues: z.input<typeof VerifyFormSchema>,
) =>
  useForm<z.infer<typeof VerifyFormSchema>>({
    resolver: zodResolver(VerifyFormSchema),
    mode: 'all',
    defaultValues,
  });
