"use client"
import React, { useState, useEffect } from 'react';
import { Product } from './types';
import { Button } from '@/components/ui/button';

interface EditFormProps {
  product: Product;
  onUpdate: (updatedProduct: FormData) => void;
  onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ product, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<Map<string, string | Blob>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const data = new Map<string, string | Blob>();
    data.set('id', product.id);
    data.set('title', product.title);
    data.set('slug', product.slug);
    data.set('description', product.description);
    data.set('price', product.price.toString());
    data.set('packPrice', product.packPrice.toString());
    if (product.discountPrice) data.set('discountPrice', product.discountPrice.toString());
    if (product.discountPackPrice) data.set('discountPackPrice', product.discountPackPrice.toString());
    data.set('packQuantity', product.packQuantity?.toString() ?? '');
    if (product.bonus) data.set('bonus', product.bonus.toString());
    if (product.minOrderItem) data.set('minOrderItem', product.minOrderItem.toString());
    data.set('weight', product.weight.toString());
    data.set('weightPack', product.weightPack.toString());
    data.set('status', product.status);
    data.set('categoryId', product.categoryId);
    setFormData(data);

    // Initialize preview URLs for existing images
    if (product.images) {
      const urls = product.images.map(image => image.imageUrl);
      setPreviewUrls(urls);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => new Map(prev).set(name, value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => {
        const updatedFormData = new Map(prev);
        updatedFormData.set('images', files[0]); // handle multiple files if needed
        return updatedFormData;
      });

      // Generate preview URLs
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    formData.forEach((value, key) => data.append(key, value));

    try {
      await onUpdate(data);
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Edit Product</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={product.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                defaultValue={product.slug}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={product.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                defaultValue={product.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="packPrice" className="block text-sm font-medium text-gray-700">
                Pack Price
              </label>
              <input
                type="number"
                id="packPrice"
                name="packPrice"
                defaultValue={product.packPrice}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">
                Discount Price
              </label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                defaultValue={product.discountPrice ?? ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="discountPackPrice" className="block text-sm font-medium text-gray-700">
                Discount Pack Price
              </label>
              <input
                type="number"
                id="discountPackPrice"
                name="discountPackPrice"
                defaultValue={product.discountPackPrice ?? ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="packQuantity" className="block text-sm font-medium text-gray-700">
                Pack Quantity
              </label>
              <input
                type="number"
                id="packQuantity"
                name="packQuantity"
                defaultValue={product.packQuantity ?? ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="bonus" className="block text-sm font-medium text-gray-700">
                Bonus
              </label>
              <input
                type="number"
                id="bonus"
                name="bonus"
                defaultValue={product.bonus ?? ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="minOrderItem" className="block text-sm font-medium text-gray-700">
                Minimum Order Item
              </label>
              <input
                type="number"
                id="minOrderItem"
                name="minOrderItem"
                defaultValue={product.minOrderItem ?? ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                defaultValue={product.weight}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="weightPack" className="block text-sm font-medium text-gray-700">
                Weight Pack
              </label>
              <input
                type="number"
                id="weightPack"
                name="weightPack"
                defaultValue={product.weightPack}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={product.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category ID
              </label>
              <input
                type="text"
                id="categoryId"
                name="categoryId"
                defaultValue={product.categoryId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="col-span-2 grid grid-cols-3 gap-4 mt-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-full h-32">
                  <img src={url} alt={`Preview ${index + 1}`} className="object-cover w-full h-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
