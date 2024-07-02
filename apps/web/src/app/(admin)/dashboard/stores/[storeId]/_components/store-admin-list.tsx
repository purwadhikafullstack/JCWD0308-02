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
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import StoreAdminItem from './store-admin-item';
import { StoreAdmin } from '@/lib/types/store';
import fetchAPI from '@/lib/fetchAPI';
import { env } from '@/app/env';

export default function StoreAdminList({
  cookie,
  storeId,
}: {
  storeId: string;
  cookie: string;
}) {
  const storeAdmins = useSuspenseQuery({
    queryKey: ['store', storeId, 'admin'],
    queryFn: async (): Promise<{ admins: StoreAdmin[] | null }> =>
      (
        await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/stores/${storeId}/admin?client=true`,
          { headers: { Cookie: cookie } },
        )
      ).json(),
  });
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader className="px-7">
        <CardTitle>Store Admins</CardTitle>
        <CardDescription>
          Manage your staff and view their performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden xl:table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeAdmins?.data?.admins?.map((storeAdmin) => (
              <StoreAdminItem
                key={storeAdmin.id}
                user={storeAdmin.storeAdmin}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
