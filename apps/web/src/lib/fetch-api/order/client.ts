import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import axios from 'axios';
import { API_URL } from '../lib';

export const getAllOrders = async (page: number, perPage: number) => {
  const response = await axios.get(`${API_URL}/order-super/all-orders`, {
    params: { page, perPage },
    withCredentials: true,
  });
  return response.data;
};
