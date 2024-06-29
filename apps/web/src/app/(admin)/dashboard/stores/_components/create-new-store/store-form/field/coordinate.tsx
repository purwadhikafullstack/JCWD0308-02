import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Map from '@/components/ui/map';
import { UseFormReturn } from 'react-hook-form';

export default function FieldCoordinate({
  latitude,
  longitude,
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
  latitude: number;
  longitude: number;
}) {
  return (
    <FormField
      control={form.control}
      name="coordinate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Store Coordinate</FormLabel>
          {/* {latitude && longitude ? ( */}
          <Map
            latitude={latitude}
            longitude={longitude}
            handleChange={field.onChange}
          />
          {/* ) : null} */}
          <FormControl>
            <Input
              placeholder="latitude, longitude (-6.868536055986229, 107.62149511534268)"
              id="coodinate"
              value={field.value || ''}
              {...form.register('coordinate')}
            />
          </FormControl>
          <FormDescription>
            This is your store coordinate, please mark your coordinate.
          </FormDescription>
          <FormMessage>
            {typeof errorMessage &&
              errorMessage}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
