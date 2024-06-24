import { API_URL } from './lib';
import axios from 'axios';
const URL = `${API_URL}/cart`;
export const addCart = async (cartData: any) => {
  const res = await axios.post(`${URL}/add-to-cart`, cartData, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  return res.data;
};

export const getCart = async () => {
  const res = await axios.get(URL, {
    withCredentials: true,
  });
  return res.data;
};

export const getCartItemCount = async () => {
  const res = await axios.get(`${URL}/item-count`, {
    withCredentials: true,
  });
  console.log(res.data);
  return res.data;
};

export const deleteCart = async (cartId: any) => {
  const res = await axios.delete(`${URL}/${cartId}`, { withCredentials: true });
  return res.data;
};

export const updateCart = async (cartData: {
  addressId: string;
  productId: string;
  quantity: number;
}) => {
  const { addressId, productId, quantity } = cartData;

  try {
    const res = await axios.patch(
      `${URL}/update-cart`,
      { addressId, productId, quantity },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );

    return res.data;
  } catch (error) {
    throw new Error(`Failed to update cart: ${error}`);
  }
};
