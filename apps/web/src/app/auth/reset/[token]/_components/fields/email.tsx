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
import { ResetPasswordSchema } from '../validation';

export default function FieldEmail({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof ResetPasswordSchema>>;
  errorMessage: string[] | string | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="opacity-70">Email</FormLabel>
          <FormControl>
            <FormInput
              disabled
              id="email"
              placeholder="name@example.com"
              type="email"
              value={field.value}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="disabled:opacity-70"
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
