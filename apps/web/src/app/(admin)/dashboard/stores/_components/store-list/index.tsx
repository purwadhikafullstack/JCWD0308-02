"use client"
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
import { getStores } from '@/lib/fetch-api/store/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { FileIcon, ListFilterIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import StoreItem from './store-list-item';


export default function StoreList() {
  const stores = useSuspenseQuery({
    queryKey: ["stores"],
    queryFn: getStores
  })
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
            {stores.data.stores.map(store => (<StoreItem key={store.id} store={store} />))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
