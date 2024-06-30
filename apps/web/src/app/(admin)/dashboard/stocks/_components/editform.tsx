"use client";
import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { updateStockAmount, fetchStockById } from '@/lib/fetch-api/stock';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FormFields from './formfields';
import { zodResolver } from '@hookform/resolvers/zod';
import { editStockSchema } from './validation';
import { handleApiError } from '@/components/toast/errorapi';
import { showSuccess } from '@/components/toast/toastutils';


interface EditStockFormProps {
  stockId: string;
  initialData: any;
  products: { id: string; title: string }[];
  stores: { id: string; name: string }[];
  onClose: () => void;
  onUpdate: (stock: any) => void;
}

const EditStockForm: React.FC<EditStockFormProps> = ({ stockId, initialData, products, stores, onClose, onUpdate }) => {
  const methods = useForm({
    resolver: zodResolver(editStockSchema),
    defaultValues: {
      ...initialData,
      mutationType: 'STOCK_IN'
    },
  });

  const { control, handleSubmit, setValue } = methods;

  useEffect(() => {
    setValue('mutationType', initialData.mutationType || 'STOCK_IN');
  }, [initialData, setValue]);

  const handleEdit = async (data: any) => {
    try {
      console.log('Data to be submitted:', data);
      await updateStockAmount(stockId, data);
      showSuccess('Stock item updated successfully');
      const updatedStock = await fetchStockById(stockId);
      onUpdate(updatedStock);
      onClose();
    } catch (error) {
      handleApiError(error, 'Failed to update stock item');
      onClose();
    }
  };

  return (
    <FormProvider {...methods}>
      <form id="editStockForm" onSubmit={handleSubmit(handleEdit)}>
        <div className="mb-4">
          <Label>Product</Label>
          <Input
            type="text"
            value={products.find(product => product.id === initialData.productId)?.title || ''}
            readOnly
            className='hover:cursor-not-allowed'
          />
        </div>
        <div className="mb-4">
          <Label>Store</Label>
          <Input
            type="text"
            value={stores.find(store => store.id === initialData.storeId)?.name || ''}
            readOnly
            className='hover:cursor-not-allowed'
          />
        </div>
        <FormFields />
        <div className="mb-4">
          <Label>Mutation Type</Label>
          <Controller
            name="mutationType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mutation Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STOCK_IN" className="hover:bg-primary hover:text-white hover:rounded-md">Stock In</SelectItem>
                  <SelectItem value="STOCK_OUT" className="hover:bg-primary hover:text-white hover:rounded-md">Stock Out</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditStockForm;
