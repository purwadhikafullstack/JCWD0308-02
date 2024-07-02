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

export default function FieldRecipient({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof FormSchema>>;
  errorMessage: string[] | undefined
}) {
  return (
    <FormField
      control={form.control}
      name="recipientName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Recipient name</FormLabel>
          <FormControl>
            <Input placeholder="John Doe" {...form.register('recipientName')} />
          </FormControl>
          <FormDescription>This is your recipient name.</FormDescription>
          <FormMessage>
            {typeof errorMessage &&
              errorMessage}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
