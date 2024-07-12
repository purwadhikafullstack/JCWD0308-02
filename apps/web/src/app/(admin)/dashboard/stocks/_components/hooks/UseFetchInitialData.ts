import { useEffect, useState } from 'react';
import {  fetchStocks } from '@/lib/fetch-api/stock';
import { getAllStores } from '@/lib/fetch-api/store/client';
import { handleApiError } from '@/components/toast/toastutils';
import { Product } from '@/lib/types/product';
import { Store } from '@/lib/types/store';
import { Stock } from '@/lib/types/stock';
import { fetchProducts } from '@/lib/fetch-api/product';

const useFetchInitialData = (triggerFetch: boolean) => {
  const [data, setData] = useState<{ products: Product[], stores: Store[], stocks: Stock[] }>({ products: [], stores: [], stocks: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productData, storeData, stockData] = await Promise.all([
          fetchProducts(),
          getAllStores(),
          fetchStocks(1, 1000, {}),
        ]);
        setData({
          products: productData.products || [],
          stores: storeData.data || [],
          stocks: stockData.stocks || [],
        });
      } catch (error) {
        handleApiError(error, 'Failed to fetch initial data');
        setError('Failed to fetch initial data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [triggerFetch]);

  return { ...data, loading, error };
};

export default useFetchInitialData;
