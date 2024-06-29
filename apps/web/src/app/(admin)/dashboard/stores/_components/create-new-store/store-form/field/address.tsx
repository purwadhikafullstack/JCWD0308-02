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

export default function FieldAddress({
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
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Store Address</FormLabel>
          <FormControl>
            <Input
              placeholder="Jl. Dago Elos IV No.407"
              {...form.register('address')}
            />
          </FormControl>
          <FormDescription>This is your store name address.</FormDescription>
          <FormMessage>{typeof errorMessage && errorMessage}</FormMessage>
        </FormItem>
      )}
    />
  );
}
