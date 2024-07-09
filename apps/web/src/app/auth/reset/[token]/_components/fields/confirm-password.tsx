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

export default function FieldConfirmPassword({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof ResetPasswordSchema>>;
  errorMessage: string[] | string | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <FormInput
              placeholder="******"
              type="password"
              value={field.value}
              {...form.register('confirmPassword')}
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
