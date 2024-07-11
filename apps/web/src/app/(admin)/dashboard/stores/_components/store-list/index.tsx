'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import StoreItem from './store-list-item';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationCustomLink,
  PaginationItem,
  PaginationCustomPrevious,
  PaginationCustomNext,
} from '@/components/ui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function StoreList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (searchInput === '')
      router.push(pathname + '?' + createQueryString('search', searchInput));
  }, [searchInput, router, pathname, createQueryString]);

  const stores = useSuspenseQuery({
    queryKey: ['stores', page, search, status],
    queryFn: () => getStores(+page, search, status),
  });

  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(pathname + '?' + createQueryString('search', searchInput));
  }

  const totalPages = stores.data?.totalPage || 1;
  const previousPage = Math.max(page - 1, 1);
  const nextPage = Math.min(page + 1, totalPages);

  const handleStatusFilterChange = (status: string) => {
    if (status === 'ALL') status = '';
    router.push(pathname + '?' + createQueryString('status', status));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <form className="relative max-w-sm" onSubmit={onSearch}>
          <Input
            onChange={(e) => setSearchInput(() => e.target.value)}
            placeholder="Search store..."
          />
          <Button
            size="icon"
            variant="ghost"
            type="submit"
            className="absolute inset-y-0 right-0 rounded-r-md px-3 text-muted-foreground"
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>

        <Select value={status} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="ALL">ALL</SelectItem>
              <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
              <SelectItem value="DRAFT">DRAFT</SelectItem>
              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
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
        {totalPages > 1 ? (
          <CardFooter>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationCustomPrevious
                    href={`${pathname}?page=${previousPage}&search=${search}`}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageIndex = index + 1;
                  return (
                    <PaginationItem key={index}>
                      <PaginationCustomLink
                        href={`${pathname}?page=${pageIndex}&search=${search}`}
                        isActive={index + 1 === page}
                      >
                        {pageIndex}
                      </PaginationCustomLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationCustomNext
                    href={`${pathname}?page=${nextPage}&search=${search}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}
