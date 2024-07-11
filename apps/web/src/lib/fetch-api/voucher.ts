import axios from "axios";
import { API_URL } from "./lib";

const URL = `${API_URL}/voucher`;

export const getVouchers = async (page: number = 1, limit: number = 8, filters: any = {}) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  }).toString();
  const response = await axios.get(`${URL}?${query}`, {
    withCredentials: true,
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetch vouchers");
  }
  return response.data;
};

export const getVoucherById = async (id: string) => {
  const response = await axios.get(`${URL}/${id}`, {
    withCredentials: true,
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetch voucher");
  }
  return response.data;
};

export const createVoucher = async (voucherData: any) => {
  const response = await axios.post(URL, voucherData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  if (response.status !== 201) {
    throw new Error("Failed to create voucher");
  }
  return response.data;
};

export const updateVoucher = async (id: string, voucherData: any) => {
  const response = await axios.put(`${URL}/${id}`, voucherData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  if (response.status !== 200) {
    throw new Error("Failed to update voucher");
  }
  return response.data;
};

export const deleteVoucher = async (id: string) => {
  const response = await axios.delete(`${URL}/${id}`, {
    withCredentials: true,
  });
  if (response.status !== 200) {
    throw new Error("Failed to delete voucher");
  }
  return response.data;
};

export const getUserVouchers = async () => {
  try {
    const response = await axios.get(`${URL}/voucher-user`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const assignVoucherToUser = async (voucherId: string, userId: string) => {
  const response = await axios.post(
    `${URL}/assign`,
    {
      voucherId,
      userId,
    },
    {
      withCredentials: true,
    },
  );
  if (response.status !== 201) {
    throw new Error("Failed to assign voucher to user");
  }
  return response.data;
};
