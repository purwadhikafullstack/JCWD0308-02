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
export const STATUS = ['DRAFT', 'INACTIVE', 'PUBLISHED', 'SUSPENDED'] as const;

export const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Please input your store name',
    })
    .min(1, 'This field is required'),
  slug: z
    .string({
      required_error: 'Please input your store slug',
    })
    .min(1, 'This field is required'),
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
  provinceId: z
    .string({
      required_error: 'Please input your store province',
    })
    .min(1, 'This field is required'),
  cityId: z
    .string({
      required_error: 'Please input your store city',
    })
    .min(1, 'This field is required'),
  address: z
    .string({
      required_error: 'Please input your store address',
    })
    .min(1, 'This field is required'),
  coordinate: z
    .string({
      required_error: 'Please input your store coordinate',
    })
    .min(1, 'This field is required'),
  latitude: z
    .string({
      required_error: 'Please input your store coordinate',
    })
    .min(1, 'This field is required'),
  longitude: z
    .string({
      required_error: 'Please input your store coordinate',
    })
    .min(1, 'This field is required'),
  status: z.enum(STATUS),
});

export const useStoreForm = (defaultValues: z.input<typeof FormSchema>) =>
  useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'all',
    defaultValues,
  });
