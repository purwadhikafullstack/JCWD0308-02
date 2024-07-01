"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import StoreCard from './store-card';
import Link from 'next/link';

export default function SelectedStore() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <StoreCard />
      <Card x-chunk="dashboard-05-chunk-1">
        <Link href={'/dashboard/orders'} className='h-max'>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className='text-xl'>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +25% from last week
            </div>
          </CardContent>
        </Link>
      </Card>
      <Card x-chunk="dashboard-05-chunk-2">
        <Link href={'/dashboard/stocks'} className='h-max'>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className='text-xl'>Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +10% from last month
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}
