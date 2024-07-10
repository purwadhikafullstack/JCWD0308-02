import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import { NearestStock } from '@/lib/types/stock';
import { Store } from '@/lib/types/store';

export const getNearestStocks = async (
  page: number = 1,
  limit: number = 10,
  filters?: Record<string, string | undefined>
): Promise<{
  stocks: NearestStock[],
  total: number,
  page: number,
  limit: number,
  store: Store
}> => {
  const query = new URLSearchParams({
    ...filters,
    page: page.toString(),
    limit: limit.toString(),
  }).toString();
  return (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/stock/nearest?${query}`)).json();
};
