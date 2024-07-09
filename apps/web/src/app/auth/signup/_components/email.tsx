import {
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { SignupFormSchema } from './validation';
import { useEffect } from 'react';

export default function FieldEmail({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof SignupFormSchema>>;
  errorMessage: string[] | string | undefined;
}) {
  useEffect(() => {
    if (typeof errorMessage === 'string')
      form.setError('email', { message: errorMessage });
  }, [errorMessage, form]);

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormMessage>
            {typeof errorMessage !== 'string' && errorMessage}
          </FormMessage>
          <FormControl>
            <FormInput
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              {...form.register('email')}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
