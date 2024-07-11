"use client";
import React, { useState, useEffect } from 'react';
import { fetchCategories } from '@/lib/fetch-api/category/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types/category';
import { Product, ProductImage } from '@/lib/types/product';
import FormFields from '../fields/FormFields';
import ImageUploader, { validateFileExtension } from './ImageProductUploader';


interface EditFormProps {
  product: Product;
  onUpdate: (updatedProduct: FormData) => void;
  onCancel: () => void;
}

const EditProductForm: React.FC<EditFormProps> = ({ product, onUpdate, onCancel }) => {
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
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (product.images) {
      const urls = product.images.map(image => ({
        imageUrl: image.imageUrl,
        id: image.id,
        productId: product.id,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }));
      setExistingImages(urls as ProductImage[]);
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
    imagesToDelete.forEach((imageId) => {
      data.append('imagesToDelete', imageId);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => validateFileExtension(file.name));

    if (validFiles.length !== files.length) {
      alert('Some files have invalid extensions and were not added.');
    }

    setImages(validFiles);
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleRemoveImage = (imageUrl: string, imageId?: string) => {
    if (imageId && existingImages.find(image => image.id === imageId)) {
      setImagesToDelete([...imagesToDelete, imageId]);
    }
    setExistingImages(existingImages.filter(image => image.id !== imageId));
    setPreviewUrls(previewUrls.filter(url => url !== imageUrl));
  };

  return (
    <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[900px] max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className='text-primary'>Edit Product</CardTitle>
          <CardDescription>Update the details of the product below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormFields formData={formData} handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} categories={categories} />
            <ImageUploader
              previewUrls={previewUrls}
              handleImageChange={handleFileChange}
              setImages={setImages}
              setPreviewUrls={setPreviewUrls}
              existingImages={existingImages}
              handleRemoveImage={handleRemoveImage}
            />
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

export default EditProductForm;
