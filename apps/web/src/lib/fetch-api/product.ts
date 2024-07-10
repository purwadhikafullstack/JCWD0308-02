import axios from "axios";
import { Product } from "../types/product";
import { API_URL } from "./lib";

export const fetchProducts = async (
  page: number = 1,
  limit?: number, // Optional limit parameter
  filters: any = {},
): Promise<{ products: Product[]; total: number; page: number }> => {
  const params: any = { page: page.toString(), ...filters };
  if (limit !== undefined) {
    params.limit = limit.toString();
  }

  const query = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_URL}/product?${query}`, {
    withCredentials: true,
  });

  if (res.status !== 200) {
    throw new Error("Failed to fetch products");
  }
  return res.data;
};

export const fetchProductById = async (id: string) => {
  const response = await axios.get(`${API_URL}/product/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const createProduct = async (productData: FormData) => {
  const response = await axios.post(`${API_URL}/product`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return response.data;
};

export const updateProduct = async (id: string, productData: FormData) => {
  const response = await axios.put(`${API_URL}/product/${id}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${API_URL}/product/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const fetchProductBySlug = async (slug: string) => {
  const response = await axios.get(`${API_URL}/product/detail/${slug}`, {
    withCredentials: true,
  });
  return response.data;
};
