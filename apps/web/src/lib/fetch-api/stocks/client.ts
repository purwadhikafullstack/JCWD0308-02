import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import { NearestStock } from '@/lib/types/stock';
import { Store } from '@/lib/types/store';

export const getNearestStocks = async ():
  Promise<{
    stocks: NearestStock[],
    total: number,
    page: number,
    limit: number,
    store: Store
  }> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/stock/nearest`)).json()