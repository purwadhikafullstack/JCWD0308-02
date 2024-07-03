import { getQueryClient } from '@/app/get-query-client';
import { getStore, getStoreAdmin } from '@/lib/fetch-api/store/server';
import React from 'react';

export default function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {

  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['store', params.storeId],
    queryFn: () => getStore(params.storeId),
  });

  queryClient.prefetchQuery({
    queryKey: ['store', params.storeId, 'admin'],
    queryFn: () => getStoreAdmin(params.storeId),
  });

  return (
    <>
      {children}
    </>
  );
}
