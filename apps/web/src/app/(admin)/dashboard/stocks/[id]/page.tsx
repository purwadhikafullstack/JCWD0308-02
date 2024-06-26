"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchStockById } from '@/lib/fetch-api/stock';
import { Toaster, toast } from '@/components/ui/sonner';
import { Stock } from '@/lib/types/stock';

const StockDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const stockId = Array.isArray(params.id) ? params.id[0] : params.id; // Ensure id is a string
        const stockData = await fetchStockById(stockId);
        setStock(stockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Failed to fetch stock data');
        toast.error('Failed to fetch stock data', {
          className: 'bg-red-500 text-white',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      {stock ? (
        <>
          <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">{stock.product.title}</h2>
          <p className="text-lg mb-8 text-center text-gray-700">Details for stock ID: {stock.id}</p>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p><strong>Store:</strong> {stock.store.name}</p>
            <p><strong>Amount:</strong> {stock.amount}</p>
            <p><strong>Description:</strong> {stock.description}</p>
            <p><strong>Created At:</strong> {new Date(stock.createdAt).toLocaleDateString()}</p>
            <p><strong>Updated At:</strong> {new Date(stock.updatedAt).toLocaleDateString()}</p>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No stock data available</p>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default StockDetail;
