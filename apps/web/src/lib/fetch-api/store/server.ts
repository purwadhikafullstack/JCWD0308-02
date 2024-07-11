import { env } from "@/app/env";
import fetchSSR from "@/lib/fetchSSR";
import { Store, StoreAdmin } from "@/lib/types/store";

export const getStores = async (page: number = 1, search: string = '', status: string = ''): Promise<{ stores: Store[], page: number, limit: number, total: number, totalPage: number }> => (await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/stores?page=${page}&search=${search}&status=${status}`)).json()

export const getSelectedStore = async (): Promise<{ store: Store }> => (await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/stores/selected`)).json()

export const getStore = async (storeId: string): Promise<{ store: Store }> => (await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/stores/${storeId}`)).json()

export const getStoreAdmin = async (storeId: string): Promise<{ admins: StoreAdmin[] }> => (await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/stores/${storeId}/admin`)).json()

