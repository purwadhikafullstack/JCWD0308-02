import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Providers from './provider';
import { validateRequest } from '@/lib/auth';
import { StoreProvider } from './storeProvider';
import { getQueryClient } from './get-query-client';
import { getUserProfile } from '@/lib/fetch-api/user/server';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getStores } from '@/lib/fetch-api/store/server';
import { Toaster } from '@/components/ui/sonner';
import { getProvinces } from '@/lib/fetch-api/province/server';
import { getCities } from '@/lib/fetch-api/city/server';

import { getAddressList, getSelectedAddress } from '@/lib/fetch-api/address/server';
import { getNearestStocks } from '@/lib/fetch-api/stocks/server';
import { getVouchers } from '@/lib/fetch-api/voucher/server';


export const runtime = 'nodejs'; // 'nodejs' (default) | 'edge'
export const fetchCache = 'default-no-store';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Grosirun',
    default: 'Grosirun', // a default is required when creating a template
  },
  description: 'Grosirun - Online Grocery Shopping, Fresh Produce, Quick Delivery',
  icons: {
    icon: '/favicon-new10.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await validateRequest();
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  queryClient.prefetchQuery({
    queryKey: ['address-list'],
    queryFn: getAddressList,
  });

  queryClient.prefetchQuery({
    queryKey: ['selected-address'],
    queryFn: getSelectedAddress,
  });

  queryClient.prefetchQuery({
    queryKey: ['stores', 1, "", ""],
    queryFn: () => getStores(1, "", ""),
  });

  queryClient.prefetchQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces,
  });

  queryClient.prefetchQuery({
    queryKey: ['cities', 0],
    queryFn: () => getCities(0),
  });

  await queryClient.prefetchQuery({
    queryKey: ['nearest-stocks', 1, 15, ''],
    queryFn: async ({ queryKey }) => {
      const filters = Object.fromEntries(new URLSearchParams(String("")));
      return getNearestStocks(Number(1), Number(15), filters);
    },
  });

  const query = new URLSearchParams({sortcol:"popular"})

  await queryClient.prefetchQuery({
   queryKey: ['nearest-stocks', 1, 15, query.toString()],
    queryFn: async ({ queryKey }) => {
      const filters = Object.fromEntries(new URLSearchParams({sortcol:"popular"}));
      return getNearestStocks(Number(1), Number(15), filters);
    }
  });


  queryClient.prefetchQuery({
    queryKey: ['carousel-voucher'],
    queryFn: () => getVouchers(),
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/favicon-new10.ico"
          sizes="any"
          type="image/x-icon"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <StoreProvider>
          <Providers>
            <HydrationBoundary state={dehydrate(queryClient)}>
              {children}
              <Toaster />
            </HydrationBoundary>
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
