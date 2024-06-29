'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSelectedStore } from '@/lib/fetch-api/store/client';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link2, MapPinned } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
const CreateNewStore = dynamic(() => import('../create-new-store'), {
  ssr: false,
});

export default function StoreCard() {
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });
  return (
    <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
      <CardHeader className="pb-3">
        <CardTitle>Manage Stores</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          Stores Dashboard for Seamless Management and Insightful Analysis.
        </CardDescription>
      </CardHeader>
      {userProfile.data?.user?.role === 'SUPER_ADMIN' ? (
        <CardFooter>
          <CreateNewStore />
        </CardFooter>
      ) : null}
    </Card>
  );
}
