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

export default function FieldLabelAddress({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof FormSchema>>;
  errorMessage: string[] | undefined
}) {
  return (
    <FormField
      control={form.control}
      name="labelAddress"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Label address</FormLabel>
          <FormControl>
            <Input placeholder="Apartment Bandung" {...form.register('labelAddress')} />
          </FormControl>
          <FormDescription>This is your label address.</FormDescription>
          <FormMessage>
            {typeof errorMessage &&
              errorMessage}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
