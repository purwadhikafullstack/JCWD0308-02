'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/partial/pagination';
import ProductTable from './_components/table/ProductTable';
import CreateProductForm from './_components/forms/CreateProductForm';
import { handleApiError, showSuccess } from '@/components/toast/toastutils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import useFetchInitialData from './_components/hooks/UseFetchInitialData';
import useFilters from './_components/hooks/UseFilters';
import SearchBarDebounce from '@/components/partial/SearchBarDeBounce';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createProduct } from '@/lib/fetch-api/product';

const ProductList = () => {
  const router = useRouter();
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const [creatingProduct, setCreatingProduct] = useState<boolean>(false);
  const { products, categories, loading, error } = useFetchInitialData(triggerFetch);
  const {
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
  } = useFilters(products);

  const userProfile = useSuspenseQuery({ queryKey: ['user-profile'], queryFn: getUserProfile });
  const isStoreAdmin = userProfile.data?.user?.role === 'STORE_ADMIN';

  const handleCreate = async (newProduct: FormData) => {
    try {
      await createProduct(newProduct);
      showSuccess('Product created successfully');
      setCreatingProduct(false);
      setTriggerFetch(prev => !prev);
    } catch (error) {
      handleApiError(error, 'Failed to create product');
    }
  };

  const handleTitleClick = (id: string) => router.push(`/dashboard/products/${id}`);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ categoryId: categoryFilter, search: searchQuery, page: newPage });
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    updateUrl({ categoryId: categoryFilter, search: query, page: 1 });
  };
  const handleCategoryFilterChange = (categoryId: string) => {
    setCategoryFilter(categoryId);
    setPage(1);
    updateUrl({ categoryId, search: searchQuery, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-primary">Products</h2>
      <p className="text-lg mb-8 text-center text-gray-700">Manage your products here.</p>
      <div className="mb-4 flex flex-col items-center sm:flex-row sm:justify-between">
        <SearchBarDebounce onSearch={handleSearch} suggestions={products.map(p => p.title)} />
        {!isStoreAdmin && (
          <Button onClick={() => setCreatingProduct(true)} className="px-6 py-2 mt-4 sm:mt-0">
            Create Product
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row">
        <div className="w-full sm:w-1/4">
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
        <div className="h-screen flex justify-center items-center">
          <span className="loader"></span>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <ProductTable products={filteredProducts} onTitleClick={handleTitleClick} />
          <Pagination total={total} page={page} limit={limit} onPageChange={handlePageChange} />
          {creatingProduct && (
            <CreateProductForm onCreate={handleCreate} onCancel={() => setCreatingProduct(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
