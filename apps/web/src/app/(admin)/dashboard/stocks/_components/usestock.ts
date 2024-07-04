"use client"
import { useState, useEffect } from 'react';
import { Stock } from '@/lib/types/stock';
import { fetchStockById } from '@/lib/fetch-api/stock';

export const useStock = (stockId: string) => {
  const [stock, setStock] = useState<Stock | null>(null);
  const [mutationsByMonth, setMutationsByMonth] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchStock = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { stock, mutationsByMonth } = await fetchStockById(stockId);
        setStock(stock);
        setMutationsByMonth(mutationsByMonth);
      } catch (err) {
        console.error('Error fetching stock:', err);
        setError('Failed to fetch stock data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [stockId]);

  return {
    stock,
    mutationsByMonth,
    isLoading,
    error,
    isEditing,
    setIsEditing,
    setStock,
    setMutationsByMonth,
  };
};
