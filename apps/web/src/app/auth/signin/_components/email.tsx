import {
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { SigninFormSchema } from './validation';

export default function FieldEmail({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof SigninFormSchema>>;
  errorMessage: string[] | string | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <FormInput
              id="email"
              placeholder="name@example.com"
              type="email"
              value={field.value}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              {...form.register('email')}
            />
          </FormControl>
          <FormMessage>
            {typeof errorMessage !== 'string' && errorMessage}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
