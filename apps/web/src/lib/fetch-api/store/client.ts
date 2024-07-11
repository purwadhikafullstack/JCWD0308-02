import { env } from "@/app/env";
import fetchAPI from "@/lib/fetchAPI";
import { Store, StoreAdmin } from "@/lib/types/store";
import axios from "axios";
import { API_URL } from "../lib";

export const getStore = async (storeId: string): Promise<{ store: Store }> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/stores/${storeId}`)).json();
export const getAllStores = async () => {
  const response = await axios.get(`${API_URL}/stores/with-relations`, {
    withCredentials: true,
  });
  return response.data;
};

export const getStores = async (page: number = 1, search: string = '', status: string = ''): Promise<{ stores: Store[], page: number, limit: number, total: number, totalPage: number }> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/stores?page=${page}&search=${search}&status=${status}`)).json();

export const getSelectedStore = async (): Promise<{ store: Store | null }> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/stores/selected`)).json();

export const getStoreAdmin = async (storeId: string): Promise<{ admins: StoreAdmin[] }> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/stores/${storeId}/admin?client=true`)).json();

export const createStore = async (formData: FormData): Promise<{ store: Store | null }> => {
  try {
    const newStore = await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/stores/`, {
      method: "POST",
      body: formData,
    });

    if (!newStore.ok) throw new Error(await newStore.json());
    return await newStore.json();
  } catch (error) {
    return error as any;
  }
};

export const deleteStore = async (
  storeId: string,
): Promise<{
  status: string;
  message: string;
  deletedStore: Store | null;
  storeFallback: Store | null;
}> => {
  try {
    const res = await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/stores/${storeId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error(await res.json());
    return await res.json();
  } catch (error) {
    console.log("hit error");

    throw error;
  }
};
