import axios from 'axios';

export const fetchProducts = async (page: number = 1, limit: number = 8, filters: any = {}): Promise<{ products: Product[], total: number, page: number, limit: number }> => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters }).toString();
  const res = await axios.get(`http://localhost:8000/api/product?${query}`, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error('Failed to fetch products');
  }
  return res.data;
};

export const fetchProductById = async (id: string) => {
  const response = await axios.get(`http://localhost:8000/api/product/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const createProduct = async (productData: FormData) => {
  const response = await axios.post(`http://localhost:8000/api/product`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return response.data;
};

export const updateProduct = async (id: string, productData: FormData) => {
  const response = await axios.put(`http://localhost:8000/api/product/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`http://localhost:8000/api/product/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
