import axios from 'axios';
import fetchSSR from '../../fetchSSR';
import { env } from '@/app/env';
import { Category } from '@/lib/types/category';

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get('http://localhost:8000/api/category', {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error('Failed to fetch categories');
  }
  return res.data.categories;
};

export const fetchCategoryById = async (id: string): Promise<Category> => {
  const res = await axios.get(`http://localhost:8000/api/category/${id}`, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error('Failed to fetch category');
  }
  return res.data.category;
};

export const createCategory = async (categoryData: Category): Promise<Category> => {
  const res = await axios.post('http://localhost:8000/api/category', categoryData, {
    withCredentials: true,
  });
  if (res.status !== 201) {
    throw new Error('Failed to create category');
  }
  return res.data.category;
};

export const updateCategory = async (id: string, categoryData: Category): Promise<Category> => {
  const res = await axios.put(`http://localhost:8000/api/category/${id}`, categoryData, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error('Failed to update category');
  }
  return res.data.category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const res = await axios.delete(`http://localhost:8000/api/category/${id}`, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error('Failed to delete category');
  }
};