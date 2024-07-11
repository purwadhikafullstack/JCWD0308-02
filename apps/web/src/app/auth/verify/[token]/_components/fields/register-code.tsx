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
import { VerifyFormSchema } from '../validation';

export default function FieldRegisterCode({
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof VerifyFormSchema>>;
  errorMessage: string[] | string | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="registerCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Referral Code</FormLabel>
          <FormControl>
            <FormInput
              placeholder="referral code"
              maxLength={8}
              value={field.value}
              {...form.register('registerCode')}
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
