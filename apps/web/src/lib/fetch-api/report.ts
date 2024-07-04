import axios from 'axios';
import { API_URL } from './lib';

export const getStockMutation = async (page: number, perPage: number) => {
  const response = await axios.get(`${API_URL}/report`, {
    params: { page, perPage },
    withCredentials: true,
  });
  return response.data;
};

export const getStockMutationById = async (page: number, perPage: number) => {
  try {
    const response = await axios.get(`${API_URL}/report/store-admin`, {
      params: { page, perPage },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('error getting stock mutation:', error);
  }
};
