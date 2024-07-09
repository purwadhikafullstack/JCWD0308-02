import { protectedRoute } from '@/lib/auth';
import React from 'react';

export default async function UserSideBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await protectedRoute.user();
  return <>{children}</>;
}
