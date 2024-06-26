import type { Metadata } from 'next';

import { cn } from '@/lib/utils';
import { validateRequest } from '@/lib/auth';
import { NavbBar } from './_components/NavBar';
import { getCategory } from '@/lib/fetch-api/category/server';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await validateRequest();
  console.log(auth);

  const categories = await getCategory();

  return (
    <>
      <div
        className={cn(
          ' sticky top-0 bg-slate-50 text-slate-950 border-b ',
          auth?.user && !auth?.user && 'top-10',
        )}
      >
        <NavbBar category={categories} />
      </div>
      {children}
    </>
  );
}
