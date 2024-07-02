import { env } from "@/app/env";
import fetchSSR from "@/lib/fetchSSR";
import { Address } from "@/lib/types/address";

export const getAddressList = async (): Promise<{ addressList: Address[] } | null> => (await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/address`)).json()

export const getSelectedAddress = async (): Promise<{ address: Address } | null> => (await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/address/selected`)).json()
