import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { getStores, getSelectedStore } from '@/lib/fetch-api/store/client';

const FormFields: React.FC = () => {
  const { control, register, setValue, watch } = useFormContext();
  const storeId = watch('storeId');

  const { data: userProfile } = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });
  const { data: stores } = useSuspenseQuery({
    queryKey: ['stores', 1, '', ""],
    queryFn: () => getStores(1, '', ""),
  });
  const { data: selectedStore } = useSuspenseQuery({
    queryKey: ['store'],
    queryFn: getSelectedStore,
  });

  const isStoreAdmin = userProfile?.user?.role === 'STORE_ADMIN';
  const storeAdminStoreId = selectedStore?.store?.id;

  useEffect(() => {
    if (isStoreAdmin && storeAdminStoreId) {
      setValue('storeId', storeAdminStoreId);
    } else if (!storeId) {
      setValue('storeId', '');
    }
  }, [isStoreAdmin, storeAdminStoreId, storeId, setValue]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 col-span-full">
      <div className="col-span-2">
        <Label htmlFor="name">Name</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} className="text-black" />}
        />
      </div>
      <div>
        <Label htmlFor="code">Code</Label>
        <Controller
          name="code"
          control={control}
          render={({ field }) => <Input {...field} className="text-black" />}
        />
      </div>
      <div className="col-span-full">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Textarea {...field} className="text-black" />}
        />
      </div>
      <div>
        <Label htmlFor="voucherType">Voucher Type</Label>
        <Controller
          name="voucherType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="text-black">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRODUCT">Product</SelectItem>
                <SelectItem value="SHIPPING_COST">Shipping Cost</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <Label htmlFor="discountType">Discount Type</Label>
        <Controller
          name="discountType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="text-black">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIXED_DISCOUNT">Fixed Discount</SelectItem>
                <SelectItem value="DISCOUNT">Discount</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <Label htmlFor="fixedDiscount">Fixed Discount</Label>
        <Controller
          name="fixedDiscount"
          control={control}
          render={({ field }) => (
            <Input type="number" {...field} className="text-black" />
          )}
        />
      </div>
      <div>
        <Label htmlFor="discount">Discount</Label>
        <Controller
          name="discount"
          control={control}
          render={({ field }) => (
            <Input type="number" {...field} className="text-black" />
          )}
        />
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Controller
          name="stock"
          control={control}
          render={({ field }) => (
            <Input type="number" {...field} className="text-black" />
          )}
        />
      </div>
      <div>
        <Label htmlFor="minOrderPrice">Minimum Order Price</Label>
        <Controller
          name="minOrderPrice"
          control={control}
          render={({ field }) => (
            <Input type="number" {...field} className="text-black" />
          )}
        />
      </div>
      <div>
        <Label htmlFor="minOrderItem">Minimum Order Item</Label>
        <Controller
          name="minOrderItem"
          control={control}
          render={({ field }) => (
            <Input type="number" {...field} className="text-black" />
          )}
        />
      </div>
      <div>
        <Label htmlFor="expiresAt">Expiration Date</Label>
        <Controller
          name="expiresAt"
          control={control}
          render={({ field }) => (
            <Input type="date" {...field} className="text-black" />
          )}
        />
      </div>
      <div className="col-span-full">
        <Label htmlFor="storeId">Store</Label>
        <Controller
          name="storeId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) =>
                field.onChange(value !== 'all' ? value : '')
              }
              value={field.value ?? ''}
              disabled={isStoreAdmin}
            >
              <SelectTrigger className="text-black">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                {!isStoreAdmin && (
                  <SelectItem value="all">Applicable to all stores</SelectItem>
                )}
                {stores?.stores?.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="col-span-full">
        <Label htmlFor="image">Image</Label>
        <input
          type="file"
          {...register('image')}
          className="mt-1 block w-full"
        />
      </div>
      <div className="flex items-center">
        <Controller
          name="isClaimable"
          control={control}
          render={({ field }) => (
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="isClaimable" className="ml-2">
          Is Claimable
        </Label>
      </div>
      <div className="flex items-center">
        <Controller
          name="isPrivate"
          control={control}
          render={({ field }) => (
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="isPrivate" className="ml-2">
          Is Private
        </Label>
      </div>
    </div>
  );
};

export default FormFields;
