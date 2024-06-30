"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFormData } from './useformdata';
import FormFields from './formfields';

interface CreateFormProps {
  onCreate: (voucher: any) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreate, onCancel }) => {
  const { formData, handleChange, setFormData } = useFormData({
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
    image: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedFormData = {
      ...formData,
      fixedDiscount: Number(formData.fixedDiscount),
      discount: Number(formData.discount),
      stock: Number(formData.stock),
      minOrderPrice: Number(formData.minOrderPrice),
      minOrderItem: Number(formData.minOrderItem),
    };
    onCreate(parsedFormData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[900px]">
        <CardHeader>
          <CardTitle>Create Voucher</CardTitle>
          <CardDescription>Fill in the details to create a new voucher.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormFields formData={formData} handleChange={handleChange} />
            <CardFooter className="mt-4 flex justify-end space-x-4">
              <Button type="button" onClick={onCancel} variant="secondary">
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateForm;
