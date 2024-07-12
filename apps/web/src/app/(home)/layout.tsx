import type { Metadata } from 'next';

import { cn } from '@/lib/utils';
import { validateRequest } from '@/lib/auth';
import { NavbBar } from './_components/navigation-bar';
import { getCategory } from '@/lib/fetch-api/category/server';
import Footer from '@/components/shared/footer';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await validateRequest();
  const categories = await getCategory();

  return (
    <>
      <div className="flex flex-col min-h-[100dvh]">
        <div
          className={cn(
            'z-10  sticky top-0 bg-slate-50 text-slate-950 border-b ',
            auth?.user && !auth?.user && 'top-10',
          )}
        >
          <NavbBar category={categories.categories} />
        </div>
        {children}
        <Footer />
      </div>
    </>
  );
}
