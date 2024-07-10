'use client';

import React, { useState, useEffect } from 'react';
import { fetchStockMutations } from '@/lib/fetch-api/report';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { StockMutation } from '@/lib/types/reports';
import { StoreSelector } from '@/app/(admin)/_components/store-selector';

const StockReport = () => {
  const [yearMonth, setYearMonth] = useState('2024-06');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [mutations, setMutations] = useState<StockMutation[]>([]);
  const [total, setTotal] = useState(0);
  const [storeId, setStoreId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedMutations, totalCount } = await fetchStockMutations(yearMonth, page, perPage, storeId);
        setMutations(fetchedMutations);
        setTotal(totalCount);
      } catch (error) {
        console.error('Failed to fetch stock mutations:', error);
      }
    };

    fetchData();
  }, [yearMonth, page, perPage, storeId]);

  const stockInData = mutations.filter(m => m.mutationType === 'STOCK_IN').reduce((acc, m) => acc + m.amount, 0);
  const stockOutData = mutations.filter(m => m.mutationType === 'STOCK_OUT').reduce((acc, m) => acc + m.amount, 0);
  const orderData = mutations.filter(m => m.mutationType === 'ORDER').reduce((acc, m) => acc + m.amount, 0);

  const chartData = {
    labels: ['Stock In', 'Stock Out', 'Orders'],
    datasets: [
      {
        label: 'Stock In',
        data: [stockInData],
        borderColor: 'rgba(75, 192, 192, 0.6)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Stock Out',
        data: [stockOutData],
        borderColor: 'rgba(255, 99, 132, 0.6)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Orders',
        data: [orderData],
        borderColor: 'rgba(255, 99, 132, 0.6)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 5000,
        stepSize: 500,
        ticks: {
          stepSize: 500,
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full max-w-6xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium">Stock Report</h3>
        <p className="text-lg text-muted-foreground">
          Select a month and year to view stock mutations.
        </p>
      </div>

      <div className="mb-8 w-full max-w-md">
        <input
          type="month"
          value={yearMonth}
          onChange={(e) => setYearMonth(e.target.value)}
          className="border p-2 rounded w-full text-lg"
        />
      </div>

      <div className="mb-8 w-full max-w-md">
        <StoreSelector storeId={storeId} className="w-full" disable={false} />
      </div>

      <div className="mb-8 w-full max-w-4xl">
        <Line data={chartData} options={chartOptions} height={100} />
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded text-lg text-center">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Type</th>
            <th className="px-4 py-2 border-b">Amount</th>
            <th className="px-4 py-2 border-b">Description</th>
            <th className="px-4 py-2 border-b">Product</th>
          </tr>
        </thead>
        <tbody>
          {mutations.map((mutation) => (
            <tr key={mutation.id}>
              <td className="px-4 py-2 border-b">{new Date(mutation.createdAt).toLocaleDateString()}</td>
              <td className={`px-4 py-2 border-b ${mutation.mutationType === 'STOCK_OUT' || mutation.mutationType === 'ORDER' ? 'text-red-500' : ''}`}>{mutation.mutationType}</td>
              <td className="px-4 py-2 border-b">{mutation.amount.toLocaleString()}</td>
              <td className="px-4 py-2 border-b">{mutation.description}</td>
              <td className="px-4 py-2 border-b">{mutation.stock.product.title}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center w-full max-w-md">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / perPage)}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={page >= Math.ceil(total / perPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StockReport;
