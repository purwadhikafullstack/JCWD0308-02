import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

export default function FieldFile({
  errorMessage,
  form,
}: {
  form: UseFormReturn<
    {
      address: string;
      name: string;
      slug: string;
      file: FileList;
      status: 'DRAFT' | 'INACTIVE' | 'PUBLISHED' | 'SUSPENDED';
      provinceId: string;
      cityId: string;
      coordinate: string;
    },
    any,
    undefined
  >;
  errorMessage: string[] | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="file"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Store Image</FormLabel>
          <FormControl>
            <Input
              accept="gif,.jpg,.jpeg,.png"
              type="file"
              {...form.register('file')}
            />
          </FormControl>
          <FormDescription>This is your store image.</FormDescription>
          <FormMessage>{typeof errorMessage && errorMessage}</FormMessage>
        </FormItem>
      )}
    />
  );
}
