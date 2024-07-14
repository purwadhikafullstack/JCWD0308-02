import { getQueryClient } from '@/app/get-query-client';
import { protectedRoute } from '@/lib/auth';
import { getUserVouchers } from '@/lib/fetch-api/voucher/server';
import React from 'react';

export default async function UserSideBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await protectedRoute.user();

  return <>{children}</>;
}
