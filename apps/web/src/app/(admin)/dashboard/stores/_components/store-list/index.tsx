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
import { getUserProfile } from '@/lib/fetch-api/user/client';

export default function StoreList() {
  const stores = useSuspenseQuery({
    queryKey: ['stores'],
    queryFn: getStores,
  });

  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
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
              <TableHead className="hidden xl:table-cell">Status</TableHead>
              {userProfile.data?.user?.role === 'SUPER_ADMIN' ? (
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              ) : null}
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
