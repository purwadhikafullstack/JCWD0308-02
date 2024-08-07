import { env } from "@/app/env";
import fetchAPI from "@/lib/fetchAPI";
import { IUserProfile } from "@/lib/types/user";
import axios from "axios";
import { API_URL } from "../lib";

export const fetchUsers = async ({ page, limit, search }: any) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
  }).toString();
  const res = await axios.get(`${API_URL}/users?${query}`, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error("Failed to fetch users");
  }
  return res.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/users`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axios.delete(`${API_URL}/users/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getUserProfile = async (): Promise<{ user: IUserProfile } | null> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/users/profile`)).json();

export const signout = () =>
  fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/auth/signout`, {
    method: "POST",
  });
