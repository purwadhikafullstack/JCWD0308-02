import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FormFields from './formfields';
import { Product } from '@/lib/types/product';
import { Store } from '@/lib/types/store';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { stockSchema } from './validation';

interface CreateFormProps {
  onCreate: (stock: any) => void;
  onCancel: () => void;
  products: Product[];
  stores: Store[];
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreate, onCancel, products, stores }) => {
  const methods = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      storeId: stores.length > 0 ? stores[0].id : '',
      productId: products.length > 0 ? products[0].id : '',
      amount: '',
      description: '',
    }
  });

  const { setValue, handleSubmit, formState: { errors } } = methods;

  useEffect(() => {
    if (products.length > 0) {
      setValue('productId', products[0].id);
    }
    if (stores.length > 0) {
      setValue('storeId', stores[0].id);
    }
  }, [products, stores, setValue]);

  const handleProductChange = (value: string) => {
    setValue('productId', value);
  };

  const handleStoreChange = (value: string) => {
    setValue('storeId', value);
  };

  const onSubmit = (data: any) => {
    const updatedFormData = {
      ...data,
      amount: parseInt(data.amount, 10),
    };
    onCreate(updatedFormData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Create Stock</CardTitle>
          <CardDescription>Fill in the details to create a new stock.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <Select onValueChange={handleProductChange} defaultValue={products[0].id} >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product"  />
                    </SelectTrigger>
                    <SelectContent >
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id} >
                          {product.title} 
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {errors.productId && <FormMessage>{errors.productId.message}</FormMessage>}
              </FormItem>
              <FormItem>
                <FormLabel>Store</FormLabel>
                <FormControl>
                  <Select onValueChange={handleStoreChange} defaultValue={stores[0].id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id} >
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {errors.storeId && <FormMessage>{errors.storeId.message}</FormMessage>}
              </FormItem>
              <FormFields />
              <CardFooter className="mt-4 flex justify-center space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </CardFooter>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateForm;
