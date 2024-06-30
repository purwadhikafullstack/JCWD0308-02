"use client"
import React from 'react';
import StoreList from './_components/store-list';
import SelectedStore from './_components/selected-store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getSelectedStore } from '@/lib/fetch-api/store/client';
import StorePreview from './_components/store-preview';

export default function StoreLayout() {
  const { data } = useSuspenseQuery({
    queryKey: ['store'],
    queryFn: getSelectedStore,
  });
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 order-2 lg:col-span-2 lg:order-1">
        <SelectedStore />
        <StoreList />
      </div>
      <div className="order-1 lg:order-2">
        {/* PAGES */}
        <StorePreview store={data?.store!} />
      </div>
    </main>
  );
}
