// _components/StockTable.tsx
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Stock } from '@/lib/types/stock';

interface StockTableProps {
  stocks: Stock[];
  handleTitleClick: (id: string) => void;
  handleDelete: (id: string) => void;
}

const StockTable: React.FC<StockTableProps> = ({ stocks, handleTitleClick, handleDelete }) => {
  return (
    <Table className="min-w-full bg-white">
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Store</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => (
          <TableRow key={stock.id}>
            <TableCell>{stock.product.title}</TableCell>
            <TableCell>{stock.store.name}</TableCell>
            <TableCell>{stock.amount}</TableCell>
            <TableCell className="flex space-x-4">
              <Button variant="secondary" onClick={() => handleTitleClick(stock.id)}>
                View
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(stock.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StockTable;
