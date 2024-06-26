import axios from 'axios';

export const getStore = async (storeId: string) => {
  const response = await axios.get(
    `http://localhost:8000/api/store/${storeId}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const getAllStores = async () => {
  const response = await axios.get(
    `http://localhost:8000/api/store`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};
