import { useEffect, useState, useCallback } from 'react';
import { Product } from '@/lib/types/product';
import { useRouter, useSearchParams } from 'next/navigation';

const useFilters = (products: Product[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 8;

  const applyFilters = useCallback(({ categoryId, search, page }: { categoryId: string; search: string; page: number }) => {
    let filtered = products;
    if (categoryId !== 'all') {
      filtered = filtered.filter(product => product.categoryId === categoryId);
    }
    if (search) {
      filtered = filtered.filter(product => product.title.toLowerCase().includes(search.toLowerCase()));
    }
    setTotal(filtered.length);
    setFilteredProducts(filtered.slice((page - 1) * limit, page * limit));
  }, [products]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const categoryIdParam = searchParams.get('categoryId') || 'all';
    setSearchQuery(query);
    setPage(pageParam);
    setCategoryFilter(categoryIdParam);
    applyFilters({ categoryId: categoryIdParam, search: query, page: pageParam });
  }, [searchParams, applyFilters]);

  const updateUrl = ({ categoryId, search, page }: { categoryId: string; search: string; page: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId !== 'all') {
      params.set('categoryId', categoryId);
    } else {
      params.delete('categoryId');
    }
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', page.toString());
    router.replace(`?${params.toString()}`);
  };

  return {
    filteredProducts,
    categoryFilter,
    searchQuery,
    page,
    total,
    limit,
    setCategoryFilter,
    setSearchQuery,
    setPage,
    updateUrl,
  };
};

export default useFilters;
