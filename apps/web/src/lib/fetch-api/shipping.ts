import { API_URL } from './lib';
import axios from 'axios';
const URL = `${API_URL}/shipping`;

export const calculateShippingCost = async (data: any) => {
  try {
    console.log('Sending request to backend:', data);
    const response = await axios.post(URL, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    console.log('Response from backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch shipping cost:', error);
    throw error;
  }
};
