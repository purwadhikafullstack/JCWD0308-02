import { Voucher } from "@/lib/types/voucher";
import { env } from "@/app/env";
import fetchAPI from "@/lib/fetchAPI";

export const getVouchers = async (page: number = 1, limit: number = 8, filters: any = {}) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters }).toString();
  const response = await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/voucher?${query}`);

  return await response.json() as { vouchers: Voucher[] };
};