'use client';

import { buttonVariants } from '@/components/ui/button';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ReceiptText, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function RightMenu() {
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const userOnly = userProfile?.data?.user?.role === 'USER' || !userProfile.data?.user

  return (
    <>
      {!userOnly ? null : (
        <Link href={'/cart'} rel="noreferrer">
          <div
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size: 'icon',
              }),
            )}
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="sr-only">Cart</span>
          </div>
        </Link>
      )}
      <Link
        href={
          userOnly
            ? '/orders'
            : '/dashboard/orders'
        }
        rel="noreferrer"
        className="hidden md:block"
      >
        <div
          className={cn(
            buttonVariants({
              variant: 'ghost',
              size: 'icon',
            }),
          )}
        >
          <ReceiptText className="h-6 w-6" />
          <span className="sr-only">Orders</span>
        </div>
      </Link>
    </>
  );
}
