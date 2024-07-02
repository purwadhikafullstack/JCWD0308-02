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
import { z } from 'zod';
import { FormSchema } from '../validation';

export default function FieldCoordinate({
  latitude,
  longitude,
  errorMessage,
  form,
}: {
  form: UseFormReturn<z.input<typeof FormSchema>>;
  errorMessage: string[] | undefined;
  latitude: number;
  longitude: number;
}) {
  const handleChangeCoords = (coords: string) => {
    form.setValue('coordinate', coords);
  };

  const handleChangeLatitude = (latitude: string) => {
    form.setValue('latitude', latitude);
  };

  const handleChangeLongitude = (longitude: string) => {
    form.setValue('longitude', longitude);
  };
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
            handleChangeCoords={handleChangeCoords}
            handleChangeLatitude={handleChangeLatitude}
            handleChangeLongitude={handleChangeLongitude}
          />
          {/* ) : null} */}
          <FormControl>
            <>
              <Input
                placeholder="latitude, longitude (-6.868536055986229, 107.62149511534268)"
                id="coodinate"
                value={field.value || ''}
                {...form.register('coordinate')}
              />
              <Input
                type="hidden"
                id="latitude"
                value={form.getValues('latitude')}
                {...form.register('latitude')}
              />
              <Input
                type="hidden"
                id="longitude"
                value={form.getValues('longitude')}
                {...form.register('longitude')}
              />
            </>
          </FormControl>
          <FormDescription>
            This is your store coordinate, please mark your coordinate.
          </FormDescription>
          <FormMessage>{typeof errorMessage && errorMessage}</FormMessage>
        </FormItem>
      )}
    />
  );
}
