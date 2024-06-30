'use client';
import { Form, Submit } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { FormEvent, useState } from 'react';
import { useUpdateStore } from './mutation';
import { useStoreForm } from './validation';
import FieldName from './field/name';
import FieldSlug from './field/slug';
import FieldFile from './field/file';
import FieldAddress from './field/address';
import FieldCoordinate from './field/coordinate';
import FieldProvince from './field/province';
import FieldCity from './field/city';
import FieldStatus from './field/status';
import { Store } from '@/lib/types/store';

export function UpdateStoreForm({
  store,
  className,
  handleClose,
}: {
  className?: string;
  handleClose: () => void;
  store: Store;
}) {
  const form = useStoreForm({
    address: store.address,
    cityId: String(store.cityId),
    coordinate: store.coordinate,
    name: store.name,
    provinceId: String(store.City.provinceId),
    slug: store.slug,
    status: store.status,
    file: undefined
  });

  const [provinceId, setProvinceId] = useState(store.City.provinceId);

  const createNewStore = useUpdateStore(handleClose, store);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await createNewStore.mutateAsync(formData);
  }

  let latitude = +form.getValues('coordinate')?.split(', ')[0] || 0;
  let longitude = +form.getValues('coordinate')?.split(', ')[1] || 0;

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
        <FieldStatus
          form={form}
          errorMessage={createNewStore?.error?.errors?.fieldErrors?.status}
        />
        <Submit type="submit">Save new changes</Submit>
      </form>
    </Form>
  );
}
