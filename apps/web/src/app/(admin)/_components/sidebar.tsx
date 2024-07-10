'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Boxes,
  LayoutGrid,
  LineChart,
  Package,
  PanelsTopLeft,
  ShoppingCart,
  Store,
  Ticket,
  Users,
} from 'lucide-react';

const menu = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <PanelsTopLeft className="h-4 w-4" />,
  },
  {
    title: 'Admins',
    path: '/dashboard/admins',
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: 'Analytics',
    path: '/dashboard/analytics',
    icon: <LineChart className="h-4 w-4" />,
  },
  {
    title: 'Orders',
    path: '/dashboard/orders',
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    title: 'Stocks',
    path: '/dashboard/stocks',
    icon: <Boxes className="h-4 w-4" />,
  },
  {
    title: 'Stores',
    path: '/dashboard/stores',
    icon: <Store className="h-4 w-4" />,
  },
  {
    title: 'Products',
    path: '/dashboard/products',
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: 'Categories',
    path: '/dashboard/categories',
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    title: 'Vouchers',
    path: '/dashboard/vouchers',
    icon: <Ticket className="h-4 w-4" />,
  },
  {
    title: 'Reports',
    path: '/dashboard/reports',
    icon: <Activity className="h-4 w-4" />,
  },
];

const SidebarMenu = ({ userRole }: { userRole: string | null }) => {
  const pathname = usePathname();

  return (
    <>
      {menu.map((item, index) => {
        if (item.title === 'Admins' && userRole === 'STORE_ADMIN') {
          return null;
        }
        return (
          <React.Fragment key={index}>
            <Link
              href={item.path}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary 
                ${pathname === item.path ? 'text-primary bg-muted' : ''}`}
            >
              {item.icon}
              {item.title}
            </Link>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default SidebarMenu;
