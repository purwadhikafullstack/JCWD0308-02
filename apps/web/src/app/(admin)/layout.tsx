import React from 'react';
import { protectedRoute } from '@/lib/auth';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { StoreSelector } from './_components/store-selector';
import SidebarMenu from './_components/sidebar';
import { AvatarDropdown } from '@/components/shared/avatar-dropdown';
import { getQueryClient } from '../get-query-client';
import { getSelectedStore } from '@/lib/fetch-api/store/server';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await protectedRoute.storeAdmin();
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ['store'],
    queryFn: getSelectedStore,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="relative hidden border-r bg-background md:block">
          <div className="sticky top-0 flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 gap-2 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <StoreSelector />
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <SidebarMenu />
              </nav>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col">
          <header className="z-10 flex h-14 items-center sticky top-0 gap-4 border-b bg-background  px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <span className="mt-6">
                    <StoreSelector />
                  </span>
                  <SidebarMenu />
                </nav>
              </SheetContent>
            </Sheet>
            <AvatarDropdown />
          </header>
          <main className="flex gap-4 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default AdminLayout;
