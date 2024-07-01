
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/voucher';

export const getVouchers = async (page: number = 1, limit: number = 8, filters: any = {}) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters }).toString();
  const response = await axios.get(`${API_URL}?${query}`, {
    withCredentials: true,
  });
  if (response.status !== 200) {
    throw new Error('Failed to fetch vouchers');
  }
  return response.data;
};

export const createVoucher = async (voucherData: any) => {
  const response = await axios.post(API_URL, voucherData, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
  return response.data;
};

export const deleteVoucher = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
