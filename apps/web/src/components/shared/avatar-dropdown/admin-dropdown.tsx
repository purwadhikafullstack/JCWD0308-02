import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Building2,
  CalendarRange,
  DollarSign,
  Heart,
  Home,
  LineChart,
  LogOut,
  PanelsTopLeft,
  Percent,
  ReceiptText,
  Settings,
  ShoppingCart,
  Ticket,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { Signout } from './signout';

const AdminDropdown = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: () => getUserProfile(),
  });

  if (!data?.user) return null;

  return (
    <>
      <DropdownMenuLabel>Organization</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href={'/'}>
          <DropdownMenuItem>
            <Building2 className="mr-2 h-4 w-4" />
            <span>{data.user.displayName}</span>
          </DropdownMenuItem>
        </Link>
        <Link href={'/dashboard'}>
          <DropdownMenuItem>
            <PanelsTopLeft className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </Link>
        <Link href={'/dashboard/orders'}>
          <DropdownMenuItem>
            <ReceiptText className="mr-2 h-4 w-4" />
            <span>orders</span>
          </DropdownMenuItem>
        </Link>
        <Link href={'/dashboard/analytics'}>
          <DropdownMenuItem>
            <LineChart className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <Link href={'/'}>
        <DropdownMenuItem>
          <Home className="mr-2 h-4 w-4" />
          <span>Home</span>
        </DropdownMenuItem>
      </Link>
      <DropdownMenuSeparator />
    </>
  );
};

export default AdminDropdown;
