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

export default function FieldName({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof FormSchema>>;
  errorMessage: string[] | undefined
}) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Store Name</FormLabel>
          <FormControl>
            <Input placeholder="Grosirun Bandung" {...form.register('name')} />
          </FormControl>
          <FormDescription>This is your store name name.</FormDescription>
          <FormMessage>
            {typeof errorMessage &&
              errorMessage}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
