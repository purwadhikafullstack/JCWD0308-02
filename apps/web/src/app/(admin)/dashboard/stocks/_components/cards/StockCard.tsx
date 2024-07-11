import React from 'react';
import { Stock } from '@/lib/types/stock';
import { Button } from '@/components/ui/button';

interface StockCardProps {
  stock: Stock;
  onTitleClick: () => void;
  onDelete: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onTitleClick, onDelete }) => (
  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="cursor-pointer" onClick={onTitleClick}>
      <h3 className="text-lg font-semibold text-gray-800">{stock.product.title}</h3>
      <p className="text-sm text-gray-600">{stock.store.name}</p>
      <p className="text-sm text-gray-600">Amount: {stock.amount}</p>
    </div>
    <div className="flex justify-end mt-4">
      <Button variant="destructive" onClick={onDelete}>
        Delete
      </Button>
    </div>
  </div>
);

export default StockCard;