"use client";
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFormData } from './useformdata';
import FormFields from './formfields';
import { Product } from '@/lib/types/product';
import { Store } from '@/lib/types/store';

interface CreateFormProps {
  onCreate: (stock: any) => void;
  onCancel: () => void;
  products: Product[];
  stores: Store[];
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreate, onCancel, products, stores }) => {
  const { formData, handleChange, setFormData } = useFormData({
    storeId: '',
    productId: '',
    amount: 0,
    description: '',
  });

  useEffect(() => {
    if (products.length > 0) {
      setFormData((prev: typeof formData) => ({
        ...prev,
        productId: products[0].id,
      }));
    }
    if (stores.length > 0) {
      setFormData((prev: typeof formData) => ({
        ...prev,
        storeId: stores[0].id,
      }));
    }
  }, [products, stores, setFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert amount to number before submitting
    const updatedFormData = {
      ...formData,
      amount: parseInt(formData.amount as unknown as string, 10),
    };
    onCreate(updatedFormData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[900px]">
        <CardHeader>
          <CardTitle>Create Stock</CardTitle>
          <CardDescription>Fill in the details to create a new stock.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormFields formData={formData} handleChange={handleChange} products={products} stores={stores} />
            <CardFooter className="mt-4 flex justify-end space-x-4">
              <Button type="button" onClick={onCancel} className="px-4 py-2 border rounded bg-gray-300">Cancel</Button>
              <Button type="submit" className="px-4 py-2 border rounded bg-blue-500 text-white">Create</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateForm;
