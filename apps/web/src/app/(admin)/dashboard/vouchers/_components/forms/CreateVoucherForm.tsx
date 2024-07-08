"use client";
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import FormFields from '../fields/FormFields';

interface CreateFormProps {
  onCreate: (voucher: FormData) => void;
  onCancel: () => void;
}

const CreateVoucherForm: React.FC<CreateFormProps> = ({ onCreate, onCancel }) => {
  const methods = useForm({
    defaultValues: {
      name: '',
      code: '',
      description: '',
      isClaimable: false,
      isPrivate: false,
      voucherType: 'PRODUCT',
      discountType: 'DISCOUNT',
      fixedDiscount: 0,
      discount: 0,
      stock: 0,
      minOrderPrice: 0,
      minOrderItem: 0,
      expiresAt: new Date(),
      imageUrl: null,
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

    onCreate(parsedFormData);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <FormFields />
        <DialogFooter className="mt-4 flex justify-end space-x-4">
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};

export default CreateVoucherForm;