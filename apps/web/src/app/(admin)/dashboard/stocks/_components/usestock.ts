"use client";
import { useState, useEffect } from 'react';
import { fetchStockById } from '@/lib/fetch-api/stock';
import { Stock } from '@/lib/types/stock'; // Correct type import

export const useStock = (stockId: string) => {
  const [stock, setStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchStockById(stockId);
        setStock(data);
      } catch (err) {
        setError('Failed to fetch stock data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [stockId]);

  return { stock, isLoading, error, setIsEditing, isEditing, setStock };
};
