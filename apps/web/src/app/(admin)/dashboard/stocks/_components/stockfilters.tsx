// _components/StockFilters.tsx
import React from 'react';
import { Store } from '@/lib/types/store';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StockFiltersProps {
  stores: Store[];
  storeFilter: string;
  handleStoreFilterChange: (storeId: string) => void;
  handleCreate: () => void;
}

const StockFilters: React.FC<StockFiltersProps> = ({ stores, storeFilter, handleStoreFilterChange, handleCreate }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button onClick={handleCreate} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all">
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
  );
};

export default StockFilters;
