'use client';
import { Form, Submit } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { FormEvent, useState } from 'react';
import { useCreateNewStore } from './mutation';
import { useStoreForm } from './validation';
import FieldName from './field/name';
import FieldSlug from './field/slug';
import FieldFile from './field/file';
import FieldAddress from './field/address';
import FieldCoordinate from './field/coordinate';
import FieldProvince from './field/province';
import FieldCity from './field/city';
import FieldStatus from './field/status';
import FieldLatitude from './field/latitude';
import FieldLongitude from './field/longitude';

export function CreateStoreForm({
  className,
  handleClose,
}: {
  className?: string;
  handleClose: () => void;
}) {
  const form = useStoreForm();

  const [provinceId, setProvinceId] = useState(0);

  const createNewStore = useCreateNewStore(handleClose);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await createNewStore.mutateAsync(formData);
  }

  let latitude = +form.getValues('latitude') || 0;
  let longitude = +form.getValues('longitude') || 0;

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn('grid items-start gap-4 p-2', className)}
        encType="multipart/form-data"
      >
        <FieldName
          form={form}
          errorMessage={createNewStore?.error?.errors?.fieldErrors?.name}
        />
        <FieldSlug
          form={form}
          errorMessage={createNewStore?.error?.errors?.fieldErrors?.slug}
        />
        <FieldFile
          form={form}
          errorMessage={createNewStore?.error?.errors?.fieldErrors?.file}
        />
        <FieldProvince
          setProvinceId={setProvinceId}
          form={form}
          errorMessage={createNewStore?.error?.errors?.fieldErrors?.provinceId}
        />
        <FieldCity
          form={form}
          errorMessage={createNewStore?.error?.errors?.fieldErrors?.cityId}
          provinceId={provinceId}
        />
        <FieldAddress
          form={form}
          errorMessage={createNewStore?.error?.errors?.fieldErrors?.address}
        />
        <FieldCoordinate
          form={form}
          errorMessage={createNewStore?.error?.errors?.fieldErrors?.coordinate}
          latitude={latitude}
          longitude={longitude}
        />
        <FieldLatitude form={form} errorMessage={createNewStore?.error?.errors?.fieldErrors?.latitude} />
        <FieldLongitude form={form} errorMessage={createNewStore?.error?.errors?.fieldErrors?.longitude} />
        <FieldStatus
          form={form}
          errorMessage={createNewStore?.error?.errors?.fieldErrors?.status}
        />
        {/* <Button type="submit">Submit</Button> */}
        <Submit type="submit">Submit</Submit>
      </form>
    </Form>
  );
}
