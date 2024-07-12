import React from 'react';
import { protectedRoute } from '@/lib/auth';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/shared/footer';
import { AvatarDropdown } from '@/components/shared/avatar-dropdown';
import Image from 'next/image';

const VerifyLayout = async ({ children }: { children: React.ReactNode }) => {
  await protectedRoute.authenticated();

  return (
    <>
      <div className="h-screen flex flex-col justify-between">
        <header className="flex items-center justify-between gap-4 sticky top-0 h-16 border-b bg-background px-4 md:px-6">
          <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Image src={'/logo-only.png'} alt="logo" height={28} width={28} />
              <span className="sr-only">grosirun</span>
            </Link>
          </nav>
          <AvatarDropdown />
        </header>
        {children}
        <Footer />
      </div>
    </>
  );
};

export default VerifyLayout;
