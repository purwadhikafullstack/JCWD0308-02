"use client";
import React, { useState, useEffect } from 'react';
import { fetchCategories } from '@/lib/fetch-api/category/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FormFields from './formfields';
import ImageUploader from './imageuploader';
import { Category } from '@/lib/types/category';
import { Product } from '@/lib/types/product';

interface EditFormProps {
  product: Product;
  onUpdate: (updatedProduct: FormData) => void;
  onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ product, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: product.price,
    packPrice: product.packPrice,
    discountPrice: product.discountPrice ?? 0,
    discountPackPrice: product.discountPackPrice ?? 0,
    packQuantity: product.packQuantity ?? 0,
    bonus: product.bonus ?? 0,
    minOrderItem: product.minOrderItem ?? 0,
    weight: product.weight,
    weightPack: product.weightPack,
    status: product.status,
    categoryId: product.categoryId,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product.images) {
      const urls = product.images.map(image => image.imageUrl);
      setPreviewUrls(urls);
    }

    const fetchCategoriesData = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    };
    fetchCategoriesData();
  }, [product]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key as keyof typeof formData].toString());
    });
    images.forEach((image) => {
      data.append('images', image);
    });

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
      <Card className="w-[900px] max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className='text-primary'>Edit Product</CardTitle>
          <CardDescription>Update the details of the product below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormFields formData={formData} handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} categories={categories} />
            <ImageUploader previewUrls={previewUrls} handleImageChange={(e) => {
              const files = Array.from(e.target.files || []);
              setImages(files);
              const urls = files.map(file => URL.createObjectURL(file));
              setPreviewUrls(urls);
            }} setImages={setImages} setPreviewUrls={setPreviewUrls} />
            <CardFooter className="mt-4 flex justify-end space-x-4">
              <Button onClick={onCancel} className="px-4 py-2" variant="destructive">
                Cancel
              </Button>
              <Button type="submit" className=" px-4 py-2" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditForm;
