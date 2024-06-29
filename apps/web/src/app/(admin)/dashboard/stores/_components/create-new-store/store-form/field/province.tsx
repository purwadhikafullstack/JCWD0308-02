import {
  FormControl,
  FormDescription,
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
import { getProvinces } from '@/lib/fetch-api/province/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function FieldProvince({
  setProvinceId,
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
  setProvinceId: (value: SetStateAction<number>) => void
}) {
  const provinces = useSuspenseQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces,
  });
  return (
    <FormField
      control={form.control}
      name="provinceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Province</FormLabel>
          <Select
            onValueChange={(e) => {
              setProvinceId(+e);
              field.onChange(e);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a province store" />
                <Input
                  type="hidden"
                  id="provinceId"
                  value={field.value}
                  {...form.register('provinceId')}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {provinces.data?.provinces?.map((p) => (
                <SelectItem key={p.id} value={`${p.id}`}>
                  {p.name}
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
