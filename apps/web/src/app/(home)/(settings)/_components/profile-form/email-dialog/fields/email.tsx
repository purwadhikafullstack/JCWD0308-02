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
import { changeEmailSchema } from '../../validation';

export default function FieldEmail({
  errorMessage,
  form,
  type,
  disabled = false,
}: {
  type: 'email' | 'newEmail';
  form: UseFormReturn<z.input<typeof changeEmailSchema>>;
  errorMessage: string[] | string | undefined;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={type}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={type === 'email' || disabled ? 'opacity-60' : ''}
          >
            {type === 'email' ? 'Email' : 'New Email'}
          </FormLabel>
          <FormControl>
            <FormInput
              className={
                type === 'email' || disabled ? 'disabled:opacity-60' : ''
              }
              disabled={type === 'email' || disabled ? true : false}
              placeholder="name@example.com"
              type="email"
              value={field.value}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              {...form.register(type)}
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
