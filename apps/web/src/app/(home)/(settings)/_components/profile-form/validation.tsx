import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const profileFormSchema = z.object({
  file: z
    .any()
    .optional()
    .refine(
      (file) =>
        file.length == 1
          ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
            ? true
            : false
          : true,
      'Invalid file. choose either JPEG or PNG image',
    )
    .refine(
      (file) =>
        file.length == 1
          ? file[0]?.size <= MAX_FILE_SIZE
            ? true
            : false
          : true,
      'Max file size allowed is 1MB.',
    ),
  displayName: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email()
    .optional(),
  password: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const changePasswordSchema = z
  .object({
    password: z.string().min(8).max(512),
    newPassword: z.string().min(8).max(512),
    confirmPassword: z.string().min(8).max(512),
  })
  .refine(
    (values) => {
      return values.password !== values.newPassword;
    },
    {
      message: 'New passwords must be different!',
      path: ['newPassword'],
    },
  )
  .refine(
    (values) => {
      return values.password !== values.confirmPassword;
    },
    {
      message: 'New passwords must be different!',
      path: ['confirmPassword'],
    },
  )
  .refine(
    (values) => {
      return values.newPassword === values.confirmPassword;
    },
    {
      message: 'Passwords must match!',
      path: ['confirmPassword'],
    },
  );

export const changeEmailSchema = z
  .object({
    email: z
      .string({
        required_error: 'Please input correct email.',
      })
      .email().optional(),
    newEmail: z
      .string({
        required_error: 'Please input correct email.',
      })
      .email(),
    password: z.string().min(8).max(512),
  })
  .refine(
    (values) => {
      return values.email !== values.newEmail;
    },
    {
      message: 'New email must be different!',
      path: ['newEmail'],
    },
  );

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;

export const useProfileForm = (defaultValues: Partial<ProfileFormValues>) =>
  useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onSubmit',
    defaultValues,
  });

export const usePasswordForm = (defaultValues: Partial<ChangePasswordValues>) =>
  useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'all',
    defaultValues,
  });

export const useEmailForm = (defaultValues: Partial<ChangeEmailValues>) =>
  useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    mode: 'all',
    defaultValues,
  });
