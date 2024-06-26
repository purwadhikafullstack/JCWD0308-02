import { API_URL } from './lib';
import axios from 'axios';
const URL = `${API_URL}/address`;
export const getAddresstById = async () => {
  const res = await axios.get(URL, {
    withCredentials: true,
  });
  return res.data;
};
