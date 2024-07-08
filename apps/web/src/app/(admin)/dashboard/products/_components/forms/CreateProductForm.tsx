"use client";
import React, { useEffect, useState } from 'react';
import { fetchCategories } from '@/lib/fetch-api/category/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types/category';
import { useFormData } from '../hooks/UseFormData';
import FormFields from '../fields/FormFields';
import ImageUploader from './ImageProductUploader';

interface CreateFormProps {
  onCreate: (product: FormData) => void;
  onCancel: () => void;
}

const CreateProductForm: React.FC<CreateFormProps> = ({ onCreate, onCancel }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { formData, handleChange, handleImageChange, images, previewUrls, setFormData, setImages, setPreviewUrls } = useFormData();

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setFormData(prev => ({
          ...prev,
          categoryId: categoriesData[0].id,
        }));
      }
    };
    fetchCategoriesData();
  }, [setFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key as keyof typeof formData].toString());
    });
    images.forEach((image) => {
      data.append('images', image);
    });
    onCreate(data);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[900px] max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className='text-primary'>Create Product</CardTitle>
          <CardDescription>Fill in the details to create a new product.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormFields formData={formData} handleChange={handleChange} categories={categories} />
            <ImageUploader
              previewUrls={previewUrls}
              handleImageChange={handleImageChange}
              setImages={setImages}
              setPreviewUrls={setPreviewUrls}
            />
            <CardFooter className="mt-4 flex justify-end space-x-4">
              <Button type="button" onClick={onCancel} variant="destructive" className="px-4 py-2">Cancel</Button>
              <Button type="submit" variant="default" className="px-4 py-2">Create</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProductForm;
