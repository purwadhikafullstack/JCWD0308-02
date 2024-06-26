"use client";
import React, { useEffect, useState } from 'react';
import { fetchCategories } from '@/lib/fetch-api/category/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFormData } from './useformdata';
import FormFields from './formfields';
import ImageUploader from './imageuploader';
import { Category } from '@/lib/types/category';

interface CreateFormProps {
  onCreate: (product: FormData) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreate, onCancel }) => {
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
      <Card className="w-[900px]">
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
          <CardDescription>Fill in the details to create a new product.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormFields formData={formData} handleChange={handleChange} categories={categories} />
            <ImageUploader previewUrls={previewUrls} handleImageChange={handleImageChange} setImages={setImages} setPreviewUrls={setPreviewUrls} />
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
