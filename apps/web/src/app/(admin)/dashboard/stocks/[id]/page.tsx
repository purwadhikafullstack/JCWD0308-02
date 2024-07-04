'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { Stock } from '@/lib/types/stock';
import { useStock } from '../_components/usestock';
import EditStockForm from '../_components/editform';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const StockDetail = () => {
  const router = useRouter();
  const { id } = useParams();

  const stockId = typeof id === 'string' ? id : id?.[0];
  const { stock, mutationsByMonth, isLoading, error, setIsEditing, isEditing, setStock, setMutationsByMonth } = useStock(stockId);

  useEffect(() => {
    // Contoh kondisi untuk mengatur isEditing
    if (isEditing) {
      console.log('Editing stock', stockId);
    }
  }, [isEditing, stockId]);

  const handleUpdate = (updatedStock: Stock, updatedMutationsByMonth: Record<string, any[]>) => {
    setStock(updatedStock);
    setMutationsByMonth(updatedMutationsByMonth);
    setIsEditing(false);
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!stock) return <p className="text-center text-gray-500">No stock data available</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <Button onClick={() => router.back()} className="mb-6 bg-gray-300 text-gray-800">
        Back
      </Button>
      <h2 className="text-3xl font-extrabold mb-6 text-center text-primary">{stock.product?.title}</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p><strong>Store:</strong> {stock.store?.name}</p>
        <p><strong>Total Stock:</strong> {stock.amount}</p>
        <p><strong>Created At:</strong> {new Date(stock.createdAt).toLocaleDateString()}</p>
        <p><strong>Updated At:</strong> {new Date(stock.updatedAt).toLocaleDateString()}</p>
      </div>
      <h3 className="text-2xl font-bold mb-4 mt-8">Stock Mutations</h3>
      {mutationsByMonth && Object.entries(mutationsByMonth).map(([monthYear, mutations]) => (
        <div key={monthYear}>
          <h4 className="text-xl font-semibold mb-2">{monthYear}</h4>
          <Table className="min-w-full bg-white">
            <TableHeader>
              <TableRow>
                <TableHead>Mutation Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mutations.map((mutation) => (
                <TableRow key={mutation.id}>
                  <TableCell>
                    <span className={mutation.mutationType === 'STOCK_IN' ? 'text-green-600' : 'text-red-600'}>
                      {mutation.mutationType}
                    </span>
                  </TableCell>
                  <TableCell>{mutation.amount}</TableCell>
                  <TableCell>{mutation.description}</TableCell>
                  <TableCell>{new Date(mutation.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
      <div className="flex justify-center mt-6">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-primary text-primary-foreground">
              Edit Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Stock</DialogTitle>
              <DialogDescription>Update the stock details below.</DialogDescription>
            </DialogHeader>
            <EditStockForm
              stockId={stock.id}
              initialData={{
                productId: stock.productId,
                storeId: stock.storeId,
                amount: stock.amount,
                description: stock.description,
                mutationType: 'STOCK_IN', 
              }}
              products={[{ id: stock.productId, title: stock.product?.title || '' }]}
              stores={[{ id: stock.storeId, name: stock.store?.name || '' }]}
              onClose={() => setIsEditing(false)}
              onUpdate={handleUpdate}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StockDetail;
