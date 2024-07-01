'use client';

import { buttonVariants } from '@/components/ui/button';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ReceiptText, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { RootState } from '@/lib/features/store';
import { fetchCartItemCount } from '@/lib/features/cart/cartSlice';
import { useEffect } from 'react';

export default function RightMenu() {
  const itemCount = useAppSelector((state: RootState) => state.cart.itemCount);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCartItemCount());
  }, [dispatch]);
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const userOnly =
    userProfile?.data?.user?.role === 'USER' || !userProfile.data?.user;

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
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>

            <span className="sr-only">Cart</span>
          </div>
        </Link>
      )}
      <Link
        href={userOnly ? '/list-orders' : '/dashboard/orders'}
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
          <span className="sr-only">List Orders</span>
        </div>
      </Link>
    </>
  );
}
