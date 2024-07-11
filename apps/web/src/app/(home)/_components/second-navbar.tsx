'use client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TruckIcon } from 'lucide-react';
import React from 'react';
import UserAddress from './user-address';
import { getNearestStocks } from '@/lib/fetch-api/stocks/client';

export default function SecondNavbar() {
  const nearestStocks = useSuspenseQuery({
    queryKey: ['nearest-stocks', 1, 15, ''],
    queryFn: async ({ queryKey }) => {
      // const [_, page, limit, queryString] = queryKey;
      const filters = Object.fromEntries(new URLSearchParams(String("")));
      return getNearestStocks(Number(1), Number(15), filters);
    }
  });

  return (
    <div className="hidden border-t sm:block py-2">
      <div className="container flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <TruckIcon className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Delivering from <span className="font-medium">{nearestStocks?.data?.store?.name}</span>
          </p>
        </div>
        <UserAddress />
      </div>
    </div>
  );
}