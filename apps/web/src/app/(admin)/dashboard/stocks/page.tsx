"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; 
import { fetchStocks, createStock } from '@/lib/fetch-api/stock';
import { fetchProducts } from '@/lib/fetch-api/product';
import { getAllStores } from '@/lib/fetch-api/store';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/partial/SearchBar';
import CreateForm from './_components/createform';
import Pagination from '@/components/partial/pagination';
import StockCard from './_components/stockcard';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster, toast } from '@/components/ui/sonner';
import { Stock } from '@/lib/types/stock';
import { Product } from '@/lib/types/product';
import { Store } from '@/lib/types/store';

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
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(8);
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);

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
        // setProducts(productData.products || []);
        setStores(storeData.data || []);  // Mengubah untuk mengambil `data` dari storeData

        console.log('Stocks:', stockData.stocks);
        console.log('Products:', productData.products);
        console.log('Stores:', storeData.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        toast.error('Failed to fetch data', {
          className: 'bg-red-500 text-white',
        });
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
      toast.success('Stock created successfully', {
        className: 'bg-green-500 text-white',
      });
      setUpdateFlag(!updateFlag);
      setCreatingStock(false);
    } catch (error) {
      console.error('Error creating stock:', error);
      toast.error('Failed to create stock', {
        className: 'bg-red-500 text-white',
      });
    }
  };

  const handleTitleClick = (id: string) => {
    router.push(`/stocks/${id}`);
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
    params.set('page', '1'); // Reset to the first page when searching
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
    params.set('page', '1'); // Reset to the first page when filtering
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">Stocks</h2>
      <p className="text-lg mb-8 text-center text-gray-700">Manage your stocks here.</p>
      <SearchBar onSearch={handleSearch} />
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setCreatingStock(true)} className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 transition-all">
          Create Stock
        </Button>
        <div className="flex space-x-4">
          <div className="w-48">
            <Select onValueChange={handleStoreFilterChange}>
              <SelectTrigger aria-label="Store Filter">
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Stores</SelectLabel>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {stocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onTitleClick={() => handleTitleClick(stock.id)}
              />
            ))}
          </div>
          {creatingStock && (
            <CreateForm onCreate={handleCreate} onCancel={() => setCreatingStock(false)} products={products} stores={stores} />
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
