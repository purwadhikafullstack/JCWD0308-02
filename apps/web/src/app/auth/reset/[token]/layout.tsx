import { env } from '@/app/env';
import { getQueryClient } from '@/app/get-query-client';
import fetchSSR from '@/lib/fetchSSR';
import React from 'react';

export default function VerifyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { token: string };
}) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ['reset-token'],
    queryFn: async () => {
      return (
        await fetchSSR(
          `${env.NEXT_PUBLIC_BASE_API_URL}/auth/reset/${params.token}`,
        )
      ).json();
    },
  });
  return <>{children}</>;
}
