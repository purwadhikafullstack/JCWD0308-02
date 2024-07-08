"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { Category } from '@/lib/types/category';
import { Product } from '@/lib/types/product';
import { createProduct, fetchProducts } from '@/lib/fetch-api/product';
import { fetchCategories } from '@/lib/fetch-api/category/client';
import SearchBar from '@/components/partial/SearchBar';
import Pagination from '@/components/partial/pagination';
import ProductTable from './_components/table/ProductTable';
import CreateProductForm from './_components/forms/CreateProductForm';
import { handleApiError, showSuccess } from '@/components/toast/toastutils';

const ProductList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingProduct, setCreatingProduct] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(8);
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

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

    fetchData();
  }, [page, limit, filters]);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
      setFilters((prevFilters: any) => ({ ...prevFilters, search: query }));
    }
  }, [searchParams]);

  const handleCreate = async (newProduct: FormData) => {
    try {
      const createdProduct = await createProduct(newProduct);
      showSuccess('Product created successfully');
      setCreatingProduct(false);
      setFilters((prevFilters: any) => ({ ...prevFilters }));
    } catch (error) {
      console.error('Error creating product:', error);
      handleApiError(error, 'Failed to create product');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
    const params = new URLSearchParams(searchParams);
    params.set('search', query);
    params.set('page', '1');
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  const handleCategoryFilterChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setFilters((filters: any) => {
        const newFilters = { ...filters };
        delete newFilters.categoryId;
        return newFilters;
      });
    } else {
      setFilters((filters: any) => ({ ...filters, categoryId }));
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h2 className="text-3xl font-extrabold mb-6 text-center text-primary">Products</h2>
      <p className="text-lg mb-8 text-center text-gray-700">Manage your products here.</p>
      <SearchBar onSearch={handleSearch} />
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setCreatingProduct(true)} className="px-6 py-2">Create Product</Button>
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
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <ProductTable products={products} onTitleClick={(id: string) => router.push(`products/${id}`)} />
          <Pagination total={total} page={page} limit={limit} onPageChange={handlePageChange} />
          {creatingProduct && <CreateProductForm onCreate={handleCreate} onCancel={() => setCreatingProduct(false)} />}
        </>
      )}
    </div>
  );
};

export default ProductList;
