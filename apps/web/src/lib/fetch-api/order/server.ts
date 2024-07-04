import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import axios from 'axios';
import { API_URL } from '../lib';
import fetchSSR from '@/lib/fetchSSR';

export const getAllOrders = async (page: number, perPage: number) => {
  const response = await fetchSSR(`${API_URL}/order-super/all-orders`);
  return await response.json();
};
