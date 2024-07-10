import {
  FormControl,
  FormField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '../validation';
import { z } from 'zod';

export default function FieldLatitude({
  form,
}: {
  form: UseFormReturn<z.input<typeof FormSchema>>;
  errorMessage: string[] | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="latitude"
      render={({ field }) => (
        <>
          <FormControl>
            <Input
            type='hidden'
              {...field}
            />
          </FormControl>
        </>
      )}
    />
  );
}
