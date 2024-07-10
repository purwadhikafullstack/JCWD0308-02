"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { fetchStocks, createStock, deleteStock } from '@/lib/fetch-api/stock';
import { fetchProducts } from '@/lib/fetch-api/product';
import SearchBar from '@/components/partial/SearchBar';
import Pagination from '@/components/partial/pagination';
import { Stock } from '@/lib/types/stock';
import { Product } from '@/lib/types/product';
import { Store } from '@/lib/types/store';
import { handleApiError, showSuccess } from '@/components/toast/toastutils';
import { getAllStores, getSelectedStore } from '@/lib/fetch-api/store/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import StockTable from './_components/tables/StockTable';
import CreateStockForm from './_components/forms/CreateStockForm';
import DeleteStockDialog from './_components/dialogs/DeleteStockDialog';
import StockFilters from './_components/filters/StockFilters';

const StockList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingStock, setCreatingStock] = useState<boolean>(false);
  const [deletingStock, setDeletingStock] = useState<Stock | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(8);
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);

  const userProfile = useSuspenseQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile
  });

  const selectedStore = useSuspenseQuery({
    queryKey: ["selected-store"],
    queryFn: getSelectedStore
  });

  const isStoreAdmin = userProfile.data?.user?.role === 'STORE_ADMIN';
  const selectedStoreId = selectedStore.data?.store?.id;

  useEffect(() => {
    if (isStoreAdmin && selectedStoreId) {
      setStoreFilter(selectedStoreId);
      setFilters((prevFilters: any) => ({ ...prevFilters, storeId: selectedStoreId }));
    }
  }, [isStoreAdmin, selectedStoreId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [stockData, productData, storeData] = await Promise.all([
          fetchStocks(page, limit, filters),
          fetchProducts(),
          getAllStores(),
        ]);
        setStocks(stockData.stocks || []);
        setTotal(stockData.total || 0);
        setProducts(productData.products || []);
        setStores(storeData.data || []);
      } catch (error) {
        handleApiError(error, 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, limit, filters, updateFlag]);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
      setFilters((prevFilters: any) => ({ ...prevFilters, search: query }));
    }
  }, [searchParams]);

  const handleCreate = async (newStock: any) => {
    try {
      const createdStock = await createStock(newStock);
      showSuccess('Stock created successfully');
      setUpdateFlag(!updateFlag);
      setCreatingStock(false);
    } catch (error) {
      handleApiError(error, 'Failed to create stock');
    }
  };

  const handleDelete = async (id: string, productName: string, storeName: string) => {
    try {
      await deleteStock(id);
      showSuccess(`Stock for ${productName} in ${storeName} deleted successfully`);
      setUpdateFlag(!updateFlag);
    } catch (error) {
      handleApiError(error, 'Failed to delete stock');
    }
  };

  const handleTitleClick = (id: string) => {
    router.push(`/dashboard/stocks/${id}`);
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

  const handleStoreFilterChange = (storeId: string) => {
    setStoreFilter(storeId);
    const newFilters = { ...filters };
    if (storeId !== 'all') {
      newFilters.storeId = storeId;
    } else {
      delete newFilters.storeId;
    }
    setFilters(newFilters);
    const params = new URLSearchParams(searchParams);
    if (storeId !== 'all') {
      params.set('storeId', storeId);
    } else {
      params.delete('storeId');
    }
    params.set('page', '1');
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-primary">Stocks</h2>
      <p className="text-lg mb-8 text-center text-gray-700">Manage your stocks here.</p>
      <SearchBar onSearch={handleSearch} />
      <StockFilters
        stores={stores}
        storeFilter={storeFilter}
        handleStoreFilterChange={handleStoreFilterChange}
        handleCreate={() => !isStoreAdmin && setCreatingStock(true)}
        isStoreAdmin={isStoreAdmin}
      />
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <StockTable
            stocks={stocks}
            handleTitleClick={handleTitleClick}
            handleDelete={(id: string) => {
              const stock = stocks.find(s => s.id === id);
              if (stock) {
                setDeletingStock(stock);
              }
            }}
            isStoreAdmin={isStoreAdmin}
          />
          {!isStoreAdmin && (
            <>
              {creatingStock && (
                <CreateStockForm onCreate={handleCreate} onCancel={() => setCreatingStock(false)} products={products} stores={stores} />
              )}
              {deletingStock && (
                <DeleteStockDialog
                  stock={deletingStock}
                  onClose={() => setDeletingStock(null)}
                  onDeleteSuccess={() => setUpdateFlag(!updateFlag)}
                />
              )}
            </>
          )}
          <Pagination
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default StockList;
