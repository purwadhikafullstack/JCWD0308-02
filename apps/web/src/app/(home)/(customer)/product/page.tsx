'use client';
import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/lib/types/category';
import { Product } from '@/lib/types/product';
import { fetchProducts } from '@/lib/fetch-api/product';
import { fetchCategories } from '@/lib/fetch-api/category/client';
import Pagination from '@/components/partial/pagination';
import { handleApiError } from '@/components/toast/toastutils';
import ProductCard from './_component/ProductCard';

const ProductList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(15);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const query = searchParams.get('search');
    const filters: any = {};
    if (query) {
      filters.search = query;
    }
    try {
      const [productData, categoryData] = await Promise.all([fetchProducts(page, limit, filters), fetchCategories()]);
      setProducts(productData.products);
      setTotal(productData.total);
      setCategories([{ id: 'all', name: 'All Categories', superAdminId: '' }, ...categoryData]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      handleApiError(error, 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [page, limit, searchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  const handleCategoryFilterChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === 'all') {
      params.delete('categoryId');
    } else {
      params.set('categoryId', categoryId);
    }
    params.set('page', '1');
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  const handleTitleClick = (slug: string) => {
    router.push(`/product/detail/${slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Welcome to Our Featured Products</h1>
        <p className="text-lg text-gray-700">Discover the best deals and enjoy shopping with us!</p>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/4">
          <Select onValueChange={handleCategoryFilterChange}>
            <SelectTrigger aria-label="Category Filter">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-gray-700 mb-4">
        Showing {products.length} of {total} products
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map(product => (
              <ProductCard key={product.id} product={product} onTitleClick={handleTitleClick} />
            ))}
          </div>
          <Pagination total={total} page={page} limit={limit} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default ProductList;
