import React from 'react';
import { protectedRoute } from '@/lib/auth';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  await protectedRoute.noAuthOnly();

  return (
    <>
      <header className="flex items-center justify-between gap-4 sticky top-0 h-16 border-b bg-background px-4 md:px-6">
        <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <ShoppingBag className="h-7 w-7" />
            <span className="sr-only">rosirun</span>
          </Link>
        </nav>
        <div className="flex w-full items-center justify-end gap-4 md:gap-2 lg:gap-4">
          <Button size={'sm'} variant={'outline'}>
            <Link href={'/auth/signin'}>Signin</Link>
          </Button>
          <Button size={'sm'}>
            <Link href={'/auth/signup'}>Signup</Link>
          </Button>
        </div>
      </header>
      {children}
    </>
  );
};

export default AuthLayout;
