import { API_URL } from "./lib";
import axios from "axios";
const URL = `${API_URL}/cart`;
export const addCart = async (cartData: any) => {
  const res = await axios.post(`${URL}/add-to-cart`, cartData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  return res.data;
};

export const getCart = async () => {
  const res = await axios.get(URL, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
    withCredentials: true,
  });
  return res.data;
};

export const getCartItemCount = async () => {
  const res = await axios.get(`${URL}/item-count`, {
    withCredentials: true,
  });
  return res.data;
};

export const checkCart = async (cartId: any, isChecked: boolean) => {
  const res = await axios.patch(`${URL}/checked`, { cartId, isChecked }, { withCredentials: true });
  return res.data;
};

export const checkCartAll = async (isChecked: boolean) => {
  const res = await axios.patch(`${URL}/checked-all`, { isChecked }, { withCredentials: true });
  return res.data;
};

export const deleteCart = async (cartId: any) => {
  const res = await axios.delete(`${URL}/${cartId}`, { withCredentials: true });
  return res.data;
};

export const updateCart = async (cartItemId: string, stockId: string, quantity: number) => {
  try {
    const res = await axios.patch(
      `${URL}/update-cart`,
      { cartItemId, stockId, quantity },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      },
    );

    return res.data;
  } catch (error) {
    throw new Error(`Failed to update cart: ${error}`);
  }
};
