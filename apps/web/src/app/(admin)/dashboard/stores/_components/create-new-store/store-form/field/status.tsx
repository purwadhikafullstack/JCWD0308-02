import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { STATUS } from '../validation';

export default function FieldStatus({
  errorMessage,
  form,
}: {
  form: UseFormReturn<
    {
      address: string;
      name: string;
      slug: string;
      file: FileList;
      status: 'DRAFT' | 'INACTIVE' | 'PUBLISHED' | 'SUSPENDED';
      provinceId: string;
      cityId: string;
      coordinate: string;
    },
    any,
    undefined
  >;
  errorMessage: string[] | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || 'DRAFT'}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a status store" />
                <Input
                  type="hidden"
                  id="status"
                  value={field.value || 'DRAFT'}
                  {...form.register('status')}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {STATUS.map((p) => (
                <SelectItem key={p} value={`${p}`}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage>{typeof errorMessage && errorMessage}</FormMessage>
        </FormItem>
      )}
    />
  );
}
