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

export const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Please input category name.',
    })
    .min(1, 'This field is required'),
  iconUrl: z
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
  imageUrl: z
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
});

export const UpdateFormSchema = z.object({
  name: z.string().min(1, 'This field is required').optional(),
  iconUrl: z
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
  imageUrl: z
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
});

export const useCategoryForm = (defaultValues?: Partial<z.infer<typeof FormSchema>>) =>
  useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      iconUrl: undefined,
      imageUrl: undefined,
      ...defaultValues,
    },
  });

export const useUpdateCategoryForm = (defaultValues?: Partial<z.infer<typeof UpdateFormSchema>>) =>
  useForm<z.infer<typeof UpdateFormSchema>>({
    resolver: zodResolver(UpdateFormSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      iconUrl: undefined,
      imageUrl: undefined,
      ...defaultValues,
    },
  });
