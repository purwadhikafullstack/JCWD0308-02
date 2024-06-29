'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileIcon, ListFilterIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getSelectedStore, getStore } from '@/lib/fetch-api/store/client';
import SelectedStore from '../_components/selected-store';
import StoreList from '../_components/store-list';
import StorePreview from '../_components/store-preview';
import StoreAdminList from './_components/store-admin-list';
import StoreCard from '../_components/selected-store/store-card';

export default function StoreLayout({
  params,
}: {
  params: { storeId: string };
}) {
  const store = useSuspenseQuery({
    queryKey: ['store', params.storeId],
    queryFn: () => getStore(params.storeId),
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 order-2 lg:col-span-2 lg:order-1">
        <SelectedStore />
        <Tabs defaultValue="store-admin">
          <div className="flex w-full items-center">
            <TabsList>
              <TabsTrigger value="store-admin">Store Admin</TabsTrigger>
              <TabsTrigger disabled value="orders">Orders</TabsTrigger>
              <TabsTrigger disabled value="stocks">Stocks</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="store-admin">
           <StoreAdminList />
          </TabsContent>
        </Tabs>
      </div>
      <div className="order-1 lg:order-2">
        <StorePreview store={store.data.store} />
      </div>
    </main>
  );
}

{/* <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
  <div className="grid auto-rows-max items-start gap-4 md:gap-8 order-2 lg:col-span-2 lg:order-1">
    <SelectedStore />
    <StoreList />
  </div>
  <div className="order-1 lg:order-2">
    PAGES
    <StorePreview store={data.store} />
  </div>
</main>; */}
