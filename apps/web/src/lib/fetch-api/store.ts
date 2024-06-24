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
