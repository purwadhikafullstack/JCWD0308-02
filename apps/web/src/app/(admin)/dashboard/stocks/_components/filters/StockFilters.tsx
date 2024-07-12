import React from 'react';
import { Store } from '@/lib/types/store';
import { Product } from '@/lib/types/product';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StockFiltersProps {
  stores: Store[];
  products: Product[];
  storeFilter: string;
  productFilter: string;
  handleStoreFilterChange: (storeId: string) => void;
  handleProductFilterChange: (productId: string) => void;
  handleCreate: () => void;
  isStoreAdmin: boolean;
}

const StockFilters: React.FC<StockFiltersProps> = ({
  stores,
  products,
  storeFilter,
  productFilter,
  handleStoreFilterChange,
  handleProductFilterChange,
  handleCreate,
  isStoreAdmin,
}) => {
  const selectedStore = stores.find(store => store.id === storeFilter);

  return (
    <div className="flex flex-wrap justify-between items-center mb-6 space-y-4 md:space-y-0">
      {!isStoreAdmin && (
        <Button onClick={handleCreate} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all">
          Create Stock
        </Button>
      )}
      <div className="flex flex-wrap space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        {!isStoreAdmin && (
          <div className="w-full md:w-48">
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
        )}
        <div className="w-full md:w-48">
          <Select onValueChange={handleProductFilterChange}>
            <SelectTrigger aria-label="Product Filter">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Products</SelectLabel>
                <SelectItem value="all">All Products</SelectItem>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isStoreAdmin && (
        <div className="w-full md:w-auto text-primary-foreground text-lg text-center md:text-left">
          {selectedStore?.name}
        </div>
      )}
    </div>
  );
};

export default StockFilters;
