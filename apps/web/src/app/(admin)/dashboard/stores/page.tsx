import React from 'react';
import StoreList from './_components/store-list';
import SelectedStore from './_components/selected-store';
import StorePreview from './_components/store-preview';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grosirun Stores',
}

export default function StoreLayout() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 order-2 lg:col-span-2 lg:order-1">
        <SelectedStore />
        <StoreList />
      </div>
      <div className="order-1 lg:order-2">
        {/* PAGES */}
        <StorePreview />
      </div>
    </main>
  );
}
