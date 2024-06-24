import axios from 'axios';
import { API_URL } from './lib';
const URL = `${API_URL}/stock`;
export const addstock = async (data: any) => {
  const res = await axios.post(URL, data, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
  return res.data;
};
export const postStockId = async (productId: string, addressId: string) => {
  const res = await axios.post(
    `${URL}/post-stock-id`,
    { productId, addressId },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    },
  );
  return res.data;
};
