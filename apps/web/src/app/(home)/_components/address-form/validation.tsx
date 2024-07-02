import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const FormSchema = z.object({
  labelAddress: z.string().min(1, 'This field is required'),
  recipientName: z.string().min(1, 'This field is required'),
  phone: z.string().min(1, 'This field is required'),
  address: z.string().min(1, 'This field is required'),
  cityId: z.string().min(1, 'This field is required'),
  provinceId: z.string().min(1, 'This field is required'),
  note: z.string().optional(),
  coordinate: z.string().min(1, 'This field is required'),
  latitude: z.string().min(1, 'This field is required'),
  longitude: z.string().min(1, 'This field is required'),
  isMainAddress: z.boolean().default(false).optional(),
});

export const useAddressForm = (defaultValues: z.input<typeof FormSchema>) =>
  useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'all',
    defaultValues,
  });
