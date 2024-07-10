import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getCarts = async (page: number, perPage: number) => {
  const response = await axios.get(`${API_URL}/cart`, {
    withCredentials: true,
  });
  return response.data;
};
