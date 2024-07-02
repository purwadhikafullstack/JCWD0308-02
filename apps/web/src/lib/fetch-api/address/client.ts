import { env } from "@/app/env";
import fetchAPI from "@/lib/fetchAPI";
import { Address } from "@/lib/types/address";

export const getAddressList = async (): Promise<{ addressList: Address[] } | null> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/address`)).json()

export const getSelectedAddress = async (): Promise<{ address: Address } | null> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/address/selected`)).json()

