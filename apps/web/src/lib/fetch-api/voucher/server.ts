import { Voucher } from "@/lib/types/voucher";
import { env } from "@/app/env";
import fetchSSR from "@/lib/fetchSSR";
import { URL } from "../lib";

export const getVouchers = async (page: number = 1, limit: number = 8, filters: any = {}) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters }).toString();
  const response = await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/voucher?${query}`);

  return await response.json() as { vouchers: Voucher };
};


export const getUserVouchers = async () => {
  try {
    const response = await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/voucher/voucher-user`);

    if (!response.ok) throw await response.json()

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};