import { API_URL } from './lib';

const URL = `${API_URL}/cart`;
export const addToCart = async (data: any) => {
  const res = await fetch(`${URL}/add-to-cart`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  return result;
};

export const getCart = async () => {
  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  return result;
};

export const updateCart = async (data: any) => {
  const res = await fetch(`${URL}/update-cart`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  return result;
};

export const deleteCart = async (cartId: any) => {
  const res = await fetch(`${URL}/${cartId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  return result;
};
