{
  /* <FormField
  control={form.control}
  name="mobile"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Use different settings for my mobile devices</FormLabel>
        <FormDescription>
          You can manage your mobile notifications in the{' '}
          <Link href="/examples/forms">mobile settings</Link> page.
        </FormDescription>
      </div>
    </FormItem>
  )}
/>; */
}
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
import { Checkbox } from '@/components/ui/checkbox';

export default function FieldCheckBox({
  form,
}: {
  form: UseFormReturn<z.input<typeof FormSchema>>;
}) {
  return (
    <FormField
      control={form.control}
      name="isMainAddress"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Make this the main address</FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
}
