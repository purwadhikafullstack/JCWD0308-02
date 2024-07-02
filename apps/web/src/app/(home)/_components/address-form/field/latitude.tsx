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

export default function FieldLatitude({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof FormSchema>>;
  errorMessage: string[] | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="latitude"
      render={({ field }) => (
        <>
          {/* <FormLabel>Store Address</FormLabel> */}
          <FormControl>
            <Input
            type='hidden'
              {...field}
            />
          </FormControl>
          {/* <FormDescription>This is your store name address.</FormDescription>
          <FormMessage>{typeof errorMessage && errorMessage}</FormMessage> */}
        </>
      )}
    />
  );
}
