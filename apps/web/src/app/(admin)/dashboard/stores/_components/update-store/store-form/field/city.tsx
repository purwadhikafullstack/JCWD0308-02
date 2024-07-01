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
import { getCities } from '@/lib/fetch-api/city/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormSchema } from '../validation';

export default function FieldCity({
  provinceId,
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof FormSchema>>;
  errorMessage: string[] | undefined;
  provinceId: number;
}) {
  const cities = useSuspenseQuery({
    queryKey: ['cities', 0],
    queryFn: () => getCities(0),
  });
  return (
    <FormField
      control={form.control}
      name="cityId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>City</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger disabled={!Boolean(provinceId)}>
                <SelectValue placeholder="Select store city" />
                <Input
                  type="hidden"
                  id="cityId"
                  value={field.value}
                  {...form.register('cityId')}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {cities.data?.cities
                ?.filter((c) => c.provinceId === provinceId)
                .map((c) => (
                  <SelectItem key={c.id} value={`${c.id}`}>
                    {`${
                      c.type.charAt(0).toUpperCase() +
                      c.type.slice(1).toLowerCase()
                    } ${c.name}`}
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
