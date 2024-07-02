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
import { FormSchema } from '../validation';
import { z } from 'zod';

export default function FieldAddress({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof FormSchema>>;
  errorMessage: string[] | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Input
              placeholder="Jl. Dago Elos IV No.407"
              {...form.register('address')}
            />
          </FormControl>
          <FormDescription>This is your shipping address.</FormDescription>
          <FormMessage>{typeof errorMessage && errorMessage}</FormMessage>
        </FormItem>
      )}
    />
  );
}
