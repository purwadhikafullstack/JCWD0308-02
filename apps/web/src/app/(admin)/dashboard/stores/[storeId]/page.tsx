import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import SelectedStore from '../_components/selected-store';
import StoreAdminList from './_components/store-admin-list';
import { headers } from 'next/headers';
import StorePreviewWrapper from './_components/store-preview-wrapper';

export default function StoreLayout({
  params,
}: {
  params: { storeId: string };
}) {
  const header = new Headers(headers());
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 order-2 lg:col-span-2 lg:order-1">
        <SelectedStore />
        <Tabs defaultValue="store-admin">
          <div className="flex w-full items-center">
            <TabsList>
              <TabsTrigger value="store-admin">Store Admin</TabsTrigger>
              <TabsTrigger disabled value="orders">
                Orders
              </TabsTrigger>
              <TabsTrigger disabled value="stocks">
                Stocks
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="store-admin">
            <StoreAdminList storeId={params.storeId} header={header} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="order-1 lg:order-2">
        <StorePreviewWrapper header={header} storeId={params.storeId} />
      </div>
    </main>
  );
}
