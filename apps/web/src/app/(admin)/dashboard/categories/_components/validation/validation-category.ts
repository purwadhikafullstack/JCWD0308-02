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
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'Icon is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 1MB.`,
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    ),
  imageUrl: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'Image is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 1MB.`,
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    ),
});

export const UpdateFormSchema = z.object({
  name: z.string().min(1, 'This field is required').optional(),
  iconUrl: z
    .instanceof(FileList)
    .refine(
      (files) => files?.length === 1,
      'Icon should be one file.'
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 1MB.`,
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    )
    .optional(),
  imageUrl: z
    .instanceof(FileList)
    .refine(
      (files) => files?.length === 1,
      'Image should be one file.'
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 1MB.`,
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    )
    .optional(),
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
