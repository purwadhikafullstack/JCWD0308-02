'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createStock, deleteStock } from '@/lib/fetch-api/stock';
import SearchBarDebounce from '@/components/partial/SearchBarDeBounce';
import Pagination from '@/components/partial/pagination';
import StockTable from './_components/tables/StockTable';
import CreateStockForm from './_components/forms/CreateStockForm';
import DeleteStockDialog from './_components/dialogs/DeleteStockDialog';
import StockFilters from './_components/filters/StockFilters';
import { handleApiError, showSuccess } from '@/components/toast/toastutils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import useFetchInitialData from './_components/hooks/UseFetchInitialData';
import useFilters from './_components/hooks/UseFilters';
import { Stock } from '@/lib/types/stock';
import { getSelectedStore } from '@/lib/fetch-api/store/client';

const StockList = () => {
  const router = useRouter();
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const [creatingStock, setCreatingStock] = useState<boolean>(false);
  const [deletingStock, setDeletingStock] = useState<Stock | null>(null);
  const { products, stores, stocks, loading, error } = useFetchInitialData(triggerFetch);
  const {
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
  } = useFilters(stocks);

  const userProfile = useSuspenseQuery({ queryKey: ['user-profile'], queryFn: getUserProfile });
  const selectedStore = useSuspenseQuery({ queryKey: ['selected-store'], queryFn: getSelectedStore });

  const isStoreAdmin = userProfile.data?.user?.role === 'STORE_ADMIN';
  const selectedStoreId = selectedStore.data?.store?.id;

  useEffect(() => {
    if (isStoreAdmin && selectedStoreId) {
      setStoreFilter(selectedStoreId);
      setPage(1);
      updateUrl({ storeId: selectedStoreId, productId: productFilter, search: searchQuery, page: 1 });
    }
  }, [isStoreAdmin, selectedStoreId, setStoreFilter, setPage, updateUrl, productFilter, searchQuery]);

  const handleCreate = async (newStock: any) => {
    try {
      await createStock(newStock);
      showSuccess('Stock created successfully');
      setCreatingStock(false);
      setTriggerFetch(prev => !prev);
    } catch (error) {
      handleApiError(error, 'Failed to create stock');
    }
  };

  const handleDelete = async (id: string, productName: string, storeName: string) => {
    try {
      await deleteStock(id);
      showSuccess(`Stock for ${productName} in ${storeName} deleted successfully`);
      setTriggerFetch(prev => !prev);
    } catch (error) {
      handleApiError(error, 'Failed to delete stock');
    }
  };

  const handleTitleClick = (id: string) => router.push(`/dashboard/stocks/${id}`);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ storeId: storeFilter, productId: productFilter, search: searchQuery, page: newPage });
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    updateUrl({ storeId: storeFilter, productId: productFilter, search: query, page: 1 });
  };
  const handleStoreFilterChange = (storeId: string) => {
    setStoreFilter(storeId);
    setPage(1);
    updateUrl({ storeId, productId: productFilter, search: searchQuery, page: 1 });
  };
  const handleProductFilterChange = (productId: string) => {
    setProductFilter(productId);
    setPage(1);
    updateUrl({ storeId: storeFilter, productId, search: searchQuery, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-primary">Stocks</h2>
      <p className="text-lg mb-8 text-center text-gray-700">Manage your stocks here.</p>
      <div className="mb-4">
        <SearchBarDebounce onSearch={handleSearch} suggestions={products.map(p => p.title)} />
      </div>
      <StockFilters
        stores={stores}
        products={products}
        storeFilter={storeFilter}
        productFilter={productFilter}
        handleStoreFilterChange={handleStoreFilterChange}
        handleProductFilterChange={handleProductFilterChange}
        handleCreate={() => !isStoreAdmin && setCreatingStock(true)}
        isStoreAdmin={isStoreAdmin}
      />
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <span className="loader"></span>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <StockTable
            stocks={filteredStocks}
            handleTitleClick={handleTitleClick}
            handleDelete={(id: string) => {
              const stock = filteredStocks.find(s => s.id === id);
              if (stock) setDeletingStock(stock);
            }}
            isStoreAdmin={isStoreAdmin}
          />
          {!isStoreAdmin && (
            <>
              {creatingStock && (
                <CreateStockForm
                  onCreate={handleCreate}
                  onCancel={() => setCreatingStock(false)}
                  products={products}
                  stores={stores}
                />
              )}
              {deletingStock && (
                <DeleteStockDialog
                  stock={deletingStock}
                  onClose={() => setDeletingStock(null)}
                  onDeleteSuccess={() => setTriggerFetch(prev => !prev)}
                />
              )}
            </>
          )}
          <Pagination total={total} page={page} limit={limit} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default StockList;
