import axios from 'axios';
import { env } from '@/app/env';
import { Category } from '@/lib/types/category';

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get(`${env.NEXT_PUBLIC_BASE_API_URL}/category`, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error('Failed to fetch categories');
  }
  return res.data.categories;
};

export const fetchCategoryById = async (id: string): Promise<Category> => {
  const res = await axios.get(`${env.NEXT_PUBLIC_BASE_API_URL}/category/${id}`, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error('Failed to fetch category');
  }
  return res.data.category;
};

export const createCategory = async (formData: FormData): Promise<Category> => {
  const res = await axios.post(`${env.NEXT_PUBLIC_BASE_API_URL}/category`, formData, {
    withCredentials: true,
  });
  if (res.status !== 201) {
    throw new Error('Failed to create category');
  }
  return res.data.category;
};

export const updateCategory = async (id: string, formData: FormData): Promise<Category> => {
  const res = await axios.put(`${env.NEXT_PUBLIC_BASE_API_URL}/category/${id}`, formData, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error('Failed to update category');
  }
  return res.data.category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const res = await axios.delete(`${env.NEXT_PUBLIC_BASE_API_URL}/category/${id}`, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error('Failed to delete category');
  }
};
