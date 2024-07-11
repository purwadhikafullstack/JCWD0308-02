'use client';
import React from 'react';
import { getNearestStocks } from '@/lib/fetch-api/stocks/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NearestStock } from '@/lib/types/stock';
import Link from 'next/link';
import { ProductCard } from '@/components/shared/product-card';

export default function PopularProducts() {
  const query = new URLSearchParams({ sortcol: 'popular' });
  const nearestStocks = useSuspenseQuery({
    queryKey: ['nearest-stocks', 1, 15, query.toString()],
    queryFn: async ({ queryKey }) => {
      const filters = Object.fromEntries(
        new URLSearchParams({ sortcol: 'popular' }),
      );
      return getNearestStocks(Number(1), Number(15), filters);
    },
  });

  if (!nearestStocks.data?.stocks?.length)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <h1>Sorry, we are out of stock! :(</h1>
      </div>
    );

  return (
    <section className="w-full py-6 sm:py-10 md:py-12 lg:py-14">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Popular Products
          </h2>
          <Link
            href="/products?sortcol=popular"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
            prefetch={false}
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-8">
          {nearestStocks.data.stocks.map(
            (stock: NearestStock, index: number) => (
              <ProductCard key={stock.id} stock={stock} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
