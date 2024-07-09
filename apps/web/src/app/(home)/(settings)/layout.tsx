'use client';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './_components/sidebar-nav';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/fetch-api/user/client';

const userNavItems = [
  {
    title: 'Profile',
    href: '/profile',
  },
  {
    title: 'Orders',
    href: '/orders',
  },
  {
    title: 'Vouchers',
    href: '/vouchers',
  },
];

const adminNavItems = [
  {
    title: 'Profile',
    href: '/profile',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: () => getUserProfile(),
  });

  return (
    <>
      <div className="container mt-4 relative rounded-[0.5rem] bg-background shadow">
        <div className="space-y-6 lg:p-10 pb-16 ">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and others.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav
                items={
                  data?.user?.role === 'USER' ? userNavItems : adminNavItems
                }
              />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
