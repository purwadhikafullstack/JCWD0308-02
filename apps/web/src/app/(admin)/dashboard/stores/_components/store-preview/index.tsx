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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSelectedStore } from '@/lib/fetch-api/store/client';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { Store } from '@/lib/types/store';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  CreditCardIcon,
  FileIcon,
  Link2,
  ListFilterIcon,
  MoveVerticalIcon,
  TruckIcon,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
// import UpdateStore from '../update-store';
const UpdateStore = dynamic(() => import('../update-store'), { ssr: false });

export default function StorePreview({ store }: { store: Store }) {
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });
  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardContent className="flex aspect-square items-center justify-center py-6">
        <Image
          src={store?.imageUrl || ''}
          width="400"
          height="400"
          alt="Product image"
          className="aspect-square object-cover rounded-lg overflow-hidden"
        />
      </CardContent>
      <CardHeader>
        <Badge variant={'outline'} className="text-xs text-primary max-w-min">
          {store?.status}
        </Badge>
        <CardTitle className="flex items-center gap-3">{store?.name}</CardTitle>
        <CardDescription>
          <Link target="_blank" href={`/stores/${store?.slug}`}>
            <span className="flex items-center gap-1">
              <Link2 className="h-4 w-4" />
              {store?.slug}
            </span>
          </Link>
        </CardDescription>
      </CardHeader>
      {userProfile.data?.user?.role === 'SUPER_ADMIN' ? (
        <CardContent className="text-3xl font-semibold ">
          <UpdateStore store={store} />
        </CardContent>
      ) : null}
    </Card>
  );
}
