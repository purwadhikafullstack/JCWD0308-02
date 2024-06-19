"use client"

import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory, updateCategory, createCategory } from '@/lib/fetch-api/category';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Category } from './components/types';
import CreateForm from './components/createform';
import EditForm from './components/editform';
import Modal from '@/components/modal/popout';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [creatingCategory, setCreatingCategory] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalError, setModalError] = useState<boolean>(false);

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
      // Create a Category object with placeholder values for missing properties
      const newCategory: Category = { id: '', superAdminId: '', ...categoryData };
      const createdCategory = await createCategory(newCategory);
      setCategories([createdCategory, ...categories]);
      setCreatingCategory(false);
      setModalContent('Category created successfully!');
      setModalError(false);
    } catch (error) {
      console.error('Error creating category:', error);
      setModalContent('Failed to create category');
      setModalError(true);
    }
  };

  const handleUpdate = async (categoryData: { id: string, name: string }) => {
    try {
      // Construct the Category object for update
      const updatedCategory: Category = { ...selectedCategory!, ...categoryData };
      const result = await updateCategory(categoryData.id, updatedCategory);
      setCategories(categories.map(cat => (cat.id === result.id ? result : cat)));
      setSelectedCategory(null);
      setModalContent('Category updated successfully!');
      setModalError(false);
    } catch (error) {
      console.error('Error updating category:', error);
      setModalContent('Failed to update category');
      setModalError(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
      setModalContent('Category deleted successfully!');
      setModalError(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      setModalContent('Failed to delete category');
      setModalError(true);
    }
  };

  const closeModal = () => {
    setModalContent(null);
    setModalError(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
              <Button variant="destructive" onClick={() => handleDelete(category.id)}>
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
      {modalContent && (
        <Modal message={modalContent} onClose={closeModal} isError={modalError} />
      )}
    </div>
  );
};

export default CategoryList;
