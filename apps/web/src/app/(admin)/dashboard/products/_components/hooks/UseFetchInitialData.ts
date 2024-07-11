import { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/fetch-api/product';
import { fetchCategories } from '@/lib/fetch-api/category/client';
import { handleApiError } from '@/components/toast/toastutils';
import { Product } from '@/lib/types/product';
import { Category } from '@/lib/types/category';

const useFetchInitialData = (triggerFetch: boolean) => {
  const [data, setData] = useState<{ products: Product[], categories: Category[] }>({ products: [], categories: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productData, categoryData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setData({
          products: productData.products || [],
          categories: [{ id: 'all', name: 'All Categories', superAdminId: '' }, ...categoryData],
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
