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
import { getStoreAdmin, getStores } from '@/lib/fetch-api/store/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { FileIcon, ListFilterIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import StoreAdminItem from './store-admin-item';
import { useParams } from 'next/navigation';

export default function StoreAdminList() {
  const params = useParams();
  const storeAdmins = useSuspenseQuery({
    queryKey: ['store', params.storeId, 'admin'],
    queryFn: () => getStoreAdmin(params.storeId as string),
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
