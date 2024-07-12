import axios from "axios";
import { API_URL } from "./lib";

export const fetchStocks = async (page: number = 1, limit: number = 8, filters: any = {}) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  }).toString();
  const res = await axios.get(`${API_URL}/stock?${query}`, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error("Failed to fetch stocks");
  }
  return res.data;
};

export const fetchStockById = async (id: string) => {
  const response = await axios.get(`${API_URL}/stock/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const createStock = async (stockData: any) => {
  const response = await axios.post(`${API_URL}/stock`, stockData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};

export const updateStockAmount = async (id: string, stockData: any) => {
  const response = await axios.put(`${API_URL}/stock/${id}`, stockData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};

export const deleteStock = async (id: string) => {
  const response = await axios.delete(`${API_URL}/stock/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
