"use client";
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import FormFields from '../fields/FormFields';
import { DialogFooter } from '@/components/ui/dialog';

interface EditFormProps {
  voucher: any;
  onUpdate: (data: FormData) => void;
  onCancel: () => void;
}

const EditVoucherForm: React.FC<EditFormProps> = ({ voucher, onUpdate, onCancel }) => {
  const methods = useForm({
    defaultValues: {
      name: voucher.name,
      code: voucher.code,
      description: voucher.description,
      isClaimable: voucher.isClaimable,
      isPrivate: voucher.isPrivate,
      voucherType: voucher.voucherType,
      discountType: voucher.discountType,
      fixedDiscount: voucher.fixedDiscount || 0,
      discount: voucher.discount || 0,
      stock: voucher.stock || 0,
      minOrderPrice: voucher.minOrderPrice || 0,
      minOrderItem: voucher.minOrderItem || 0,
      expiresAt: new Date(voucher.expiresAt),
      image: null,
    },
  });

  const handleSubmit = (data: any) => {
    const parsedFormData = new FormData();
    for (const key in data) {
      if (key !== 'image') {
        parsedFormData.append(key, data[key]);
      }
    }
    if (data.image) {
      parsedFormData.append('image', data.image[0]);
    }
    parsedFormData.set('isClaimable', data.isClaimable ? 'true' : 'false');
    parsedFormData.set('isPrivate', data.isPrivate ? 'true' : 'false');
    parsedFormData.set('fixedDiscount', data.fixedDiscount.toString());
    parsedFormData.set('discount', data.discount.toString());
    parsedFormData.set('stock', data.stock.toString());
    parsedFormData.set('minOrderPrice', data.minOrderPrice.toString());
    parsedFormData.set('minOrderItem', data.minOrderItem.toString());

    onUpdate(parsedFormData);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <FormFields />
        <DialogFooter className="mt-4 flex justify-end space-x-4">
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button type="submit" variant="secondary">
            Update
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};

export default EditVoucherForm;