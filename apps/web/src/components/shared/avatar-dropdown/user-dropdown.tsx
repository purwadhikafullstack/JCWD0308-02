import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Heart, Percent, ReceiptText, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';

const UserDropdown = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: () => getUserProfile(),
  });

  if (!data?.user) return null;

  return (
    <>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href={'/profile'}>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>{data?.user.displayName}</span>
          </DropdownMenuItem>
        </Link>
        <Link href={'/cart'}>
          <DropdownMenuItem>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Cart</span>
          </DropdownMenuItem>
        </Link>
        <Link href={'/list-orders'}>
          <DropdownMenuItem>
            <ReceiptText className="mr-2 h-4 w-4" />
            <span>Orders</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
    </>
  );
};

export default UserDropdown;
