import { useEffect, useState, useCallback } from 'react';
import { Stock } from '@/lib/types/stock';
import { useRouter, useSearchParams } from 'next/navigation';

const useFilters = (stocks: Stock[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 8;

  const applyFilters = useCallback(({ storeId, productId, search, page }: { storeId: string; productId: string; search: string; page: number }) => {
    let filtered = stocks;
    if (storeId !== 'all') filtered = filtered.filter(stock => stock.storeId === storeId);
    if (productId !== 'all') filtered = filtered.filter(stock => stock.productId === productId);
    if (search) filtered = filtered.filter(stock => stock.product.title.toLowerCase().includes(search.toLowerCase()));
    setTotal(filtered.length);
    setFilteredStocks(filtered.slice((page - 1) * limit, page * limit));
  }, [stocks]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const storeIdParam = searchParams.get('storeId') || 'all';
    const productIdParam = searchParams.get('productId') || 'all';
    setSearchQuery(query);
    setPage(pageParam);
    setStoreFilter(storeIdParam);
    setProductFilter(productIdParam);
    applyFilters({ storeId: storeIdParam, productId: productIdParam, search: query, page: pageParam });
  }, [searchParams, stocks, applyFilters]);

  const updateUrl = ({ storeId, productId, search, page }: { storeId: string; productId: string; search: string; page: number }) => {
    const params = new URLSearchParams();
    if (storeId !== 'all') params.set('storeId', storeId);
    if (productId !== 'all') params.set('productId', productId);
    if (search) params.set('search', search);
    params.set('page', page.toString());
    router.replace(`?${params.toString()}`);
  };

  return {
    filteredStocks,
    storeFilter,
    productFilter,
    searchQuery,
    page,
    total,
    limit,
    setStoreFilter,
    setProductFilter,
    setSearchQuery,
    setPage,
    updateUrl,
  };
};

export default useFilters;
