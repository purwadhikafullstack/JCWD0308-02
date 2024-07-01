import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import { IUserProfile } from '@/lib/types/user';
import axios from 'axios';

export const fetchUsers = async () => {
  const response = await axios.get(`http://localhost:8000/api/users`, {
    withCredentials: true,
  });
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await axios.put(`http://localhost:8000/api/users/${id}`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await axios.post(`http://localhost:8000/api/users`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axios.delete(`http://localhost:8000/api/users/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getUserProfile = async (): Promise<{ user: IUserProfile } | null> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/users/profile`)).json()

export const signout = () => fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/auth/signout`, {
  method: "POST",
})