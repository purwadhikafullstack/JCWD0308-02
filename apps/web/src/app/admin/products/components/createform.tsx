"use client"
import React, { useState, useEffect } from 'react';
import { fetchCategories } from '@/lib/fetch-api/category';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category } from '@/app/admin/categories/components/types';
import Image from 'next/image';

interface CreateFormProps {
  onCreate: (product: FormData) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    packPrice: 0,
    discountPrice: 0,
    discountPackPrice: 0,
    packQuantity: 0,
    bonus: 0,
    minOrderItem: 0,
    weight: 0,
    weightPack: 0,
    status: 'DRAFT',
    categoryId: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

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
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Pack Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="packPrice"
                  value={formData.packPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Discount Pack Price
                </label>
                <input
                  type="number"
                  name="discountPackPrice"
                  value={formData.discountPackPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Pack Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="packQuantity"
                  value={formData.packQuantity}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Bonus
                </label>
                <input
                  type="number"
                  name="bonus"
                  value={formData.bonus}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Min Order Item
                </label>
                <input
                  type="number"
                  name="minOrderItem"
                  value={formData.minOrderItem}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Weight <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Weight Pack <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="weightPack"
                  value={formData.weightPack}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
              <div className="col-span-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div className="col-span-4 grid grid-cols-3 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative w-full h-32">
                    <Image src={url} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={() => {
                        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
                        setImages((prev) => prev.filter((_, i) => i !== index));
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
