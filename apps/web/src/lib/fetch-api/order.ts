import axios from "axios";
import { API_URL } from "./lib";

//super admin
export const getAllOrders = async (page: number, perPage: number) => {
  const response = await axios.get(`${API_URL}/order-super/all-orders`, {
    params: { page, perPage },
    withCredentials: true,
  });
  return response.data;
};

export const confirmPaymentByAdmin = async (orderId: string, newStatus: string) => {
  const response = await axios.post(
    `${API_URL}/order-super/${orderId}/confirm-payment`,
    { orderId, newStatus },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

//store admin
export const getOrdersByStoreAdmin = async (page: number, perPage: number) => {
  const response = await axios.get(`${API_URL}/order-store`, {
    params: { page, perPage },
    withCredentials: true,
  });
  return response.data;
};

export const cancelOrderByAdmin = async (orderId: any) => {
  const response = await axios.post(
    `${API_URL}/order-store/${orderId}/cancel-by-admin`,
    { orderId },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const sendOrder = async (orderId: any, newStatus: string) => {
  const response = await axios.post(
    `${API_URL}/order-store/${orderId}/send`,
    { orderId, newStatus },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

//customer
export const getOrder = async (orderId: string) => {
  const response = await axios.get(`${API_URL}/order/${orderId}`, {
    withCredentials: true,
    // params: { orderId, orderStatus },
  });
  return response.data;
};

export const getOrdersByStatus = async (status: string, orderId?: string, date?: string) => {
  const queryParams = new URLSearchParams();
  if (orderId) queryParams.append("orderId", orderId);
  if (date) queryParams.append("date", date);
  const response = await axios.get(`${API_URL}/order/status/${status}`, {
    withCredentials: true,
  });
  return response.data;
};

export const addOrder = async (data: any) => {
  const response = await axios.post(`${API_URL}/order`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const cancelOrder = async (orderId: any) => {
  const response = await axios.post(`${API_URL}/order/${orderId}/cancel`, orderId, {
    withCredentials: true,
  });
  return response.data;
};

export const confirmOrder = async (orderId: any) => {
  const response = await axios.post(`${API_URL}/order/${orderId}/confirm`, orderId, {
    withCredentials: true,
  });
  return response.data;
};

export const uploadPaymentProof = async (orderId: string, file: File) => {
  const formData = new FormData();
  formData.append("proof", file);

  const response = await axios.patch(`${API_URL}/order/${orderId}/payment-proof`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
