import { Product } from '@/lib/types/product';
import { Store } from '@/lib/types/store';
import React from 'react';

interface FormFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  products: Product[];
  stores: Store[];
}

const FormFields: React.FC<FormFieldsProps> = ({ formData, handleChange, products, stores }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Product</label>
        <select name="productId" value={formData.productId} onChange={handleChange} className="mt-1 block w-full">
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.title}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Store</label>
        <select name="storeId" value={formData.storeId} onChange={handleChange} className="mt-1 block w-full">
          {stores.map(store => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="mt-1 block w-full" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full"></textarea>
      </div>
    </>
  );
};

export default FormFields;
