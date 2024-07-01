'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getStores } from '@/lib/fetch-api/store/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import StoreItem from './store-list-item';

export default function StoreList() {
  const stores = useSuspenseQuery({
    queryKey: ['stores'],
    queryFn: getStores,
  });
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader className="px-7">
        <CardTitle>Stores</CardTitle>
        <CardDescription>
          Manage your stores and view their performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.data.stores.map((store) => (
              <StoreItem key={store.id} store={store} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
