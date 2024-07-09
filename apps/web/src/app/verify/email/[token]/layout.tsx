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
    queryKey: ['email-token'],
    queryFn: async () => {
      return (
        await fetchSSR(
          `${env.NEXT_PUBLIC_BASE_API_URL}/users/profile/email/${params.token}`,
        )
      ).json();
    },
  });
  return <>{children}</>;
}
