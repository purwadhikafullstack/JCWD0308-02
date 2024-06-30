import axios from 'axios';
const URL = process.env.NEXT_PUBLIC_BASE_API_URL;
export const getStore = async (storeId: string) => {
  const response = await axios.get(`${URL}/store/${storeId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getAllStores = async () => {
  const response = await axios.get(`${URL}/store`, {
    withCredentials: true,
  });
  return response.data;
};
