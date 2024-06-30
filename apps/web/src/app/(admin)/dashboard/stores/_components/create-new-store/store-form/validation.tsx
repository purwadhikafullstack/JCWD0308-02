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
      required_error: 'Please select an email to display.',
    })
    .min(1, 'This field is required'),
  slug: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .min(1, 'This field is required'),
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 1MB.`,
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    ),
  provinceId: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .min(1, 'This field is required'),
  cityId: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .min(1, 'This field is required'),
  address: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .min(1, 'This field is required'),
  coordinate: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .min(1, 'This field is required'),
  status: z.enum(STATUS),
});

export const useStoreForm = () =>
  useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      provinceId: '',
      address: '',
      cityId: '',
      coordinate: '',
      status: 'DRAFT',
    },
  });
