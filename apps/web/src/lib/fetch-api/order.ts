import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/order';

export const getAllOrders = async () => {
  const response = await axios.get(`${BASE_URL}/super-admin/orders`, {
    withCredentials: true,
  });
  return response.data;
};

export const getOrdersByStoreAdmin = async (storeAdminId: string) => {
  const response = await axios.get(
    `${BASE_URL}/store-admin/order/${storeAdminId}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const getOrder = async (orderId?: string, orderStatus?: string) => {
  const response = await axios.get(`${BASE_URL}`, {
    withCredentials: true,
    params: { orderId, orderStatus },
  });
  return response.data;
};

export const addOrder = async (data: any) => {
  const response = await axios.post(`${BASE_URL}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const cancelOrder = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/cancel-order`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const sendOrder = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/send-order`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const confirmOrder = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/confirm-order`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const cancelOrderByAdmin = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/cancel-by-admin`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const confirmPaymentByAdmin = async (orderId: string) => {
  const response = await axios.post(
    `${BASE_URL}/${orderId}/confirm`,
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const uploadPaymentProof = async (orderId: string, file: File) => {
  const formData = new FormData();
  formData.append('proof', file);

  const response = await axios.patch(
    `${BASE_URL}/${orderId}/payment-proof`,
    formData,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};
