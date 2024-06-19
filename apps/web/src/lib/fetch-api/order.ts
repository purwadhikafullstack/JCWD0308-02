import axios from 'axios';

export const getAllOrders = async () => {
  const response = await axios.get(
    `http://localhost:8000/api/order/super-admin/orders`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};
export const getOrdersByStoreAdmin = async () => {
  const response = await axios.get(
    `http://localhost:8000/api/order/store-admin/order/:storeAdminId`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};
