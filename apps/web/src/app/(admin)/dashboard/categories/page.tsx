"use client";

import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory, updateCategory, createCategory } from '@/lib/fetch-api/category/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import CreateForm from './_components/forms/CreateCategoryForm';
import EditForm from './_components/forms/EditCategoryForm';
import { Toaster, toast } from '@/components/ui/sonner';
import { Category } from '@/lib/types/category';
import DeleteCategoryDialog from './_components/dialogs/DeleteCategoriesDialog';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [creatingCategory, setCreatingCategory] = useState<boolean>(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleCreate = async (categoryData: { name: string }) => {
    try {
      const newCategory: Category = { id: '', superAdminId: '', ...categoryData };
      const createdCategory = await createCategory(newCategory);
      setCategories([createdCategory, ...categories]);
      setCreatingCategory(false);
      toast.success('Category created successfully!', {
        className: 'bg-green-500 text-white',
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category', {
        className: 'bg-red-500 text-white',
      });
    }
  };

  const handleUpdate = async (categoryData: { id: string, name: string }) => {
    try {
      const updatedCategory: Category = { ...selectedCategory!, ...categoryData };
      const result = await updateCategory(categoryData.id, updatedCategory);
      setCategories(categories.map(cat => (cat.id === result.id ? result : cat)));
      setSelectedCategory(null);
      toast.success('Category updated successfully!', {
        className: 'bg-green-500 text-white',
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category', {
        className: 'bg-red-500 text-white',
      });
    }
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">Categories</h2>
      <Button onClick={() => setCreatingCategory(true)} className="mb-4">
        Create Category
      </Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <Card key={category.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>ID:</strong> {category.id}</p>
              <p><strong>Admin ID:</strong> {category.superAdminId}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => handleEdit(category)}>
                <FaEdit />
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(category)}>
                <FaTrashAlt />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {creatingCategory && (
        <CreateForm
          onSave={handleCreate}
          onCancel={() => setCreatingCategory(false)}
        />
      )}
      {selectedCategory && (
        <EditForm
          category={selectedCategory}
          onSave={handleUpdate}
          onCancel={() => setSelectedCategory(null)}
        />
      )}
      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onDeleteSuccess={() => setCategories(categories.filter(cat => cat.id !== deletingCategory.id))}
        />
      )}
    </div>
  );
};

export default CategoryList;
