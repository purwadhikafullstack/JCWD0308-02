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

export default function FieldSlug({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof FormSchema>>;
  errorMessage: string[] | undefined
}) {
  return (
    <FormField
      control={form.control}
      name="slug"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Store Slug</FormLabel>
          <FormControl>
            <Input placeholder="grosirun-bandung" {...form.register('slug')} />
          </FormControl>
          <FormDescription>This is your store slug.</FormDescription>
          <FormMessage>
            {typeof errorMessage &&
              errorMessage}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
