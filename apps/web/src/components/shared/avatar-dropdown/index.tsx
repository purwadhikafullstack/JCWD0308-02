'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Signout } from './signout';
import { ReceiptText, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
const UserDropdown = dynamic(() => import('./user-dropdown'));
const AdminDropdown = dynamic(() => import('./admin-dropdown'));

export const AvatarDropdown = () => {
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  console.log(userProfile.data);

  if (!userProfile.data?.user) {
    return (
      <>
        <Button size={'sm'}>
          <Link href={'auth/signin'}>Signin</Link>
        </Button>
      </>
    );
  }

  console.log(userProfile.data.user.avatarUrl);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="ml-auto rounded-full text-primary w-10 h-10 cursor-pointer">
          <AvatarImage
            src={`${userProfile.data.user.avatarUrl}`}
            alt={userProfile.data.user.displayName.toUpperCase()}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback>
            {userProfile.data.user.displayName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* <Button variant="ghost" size="icon" className="rounded-full">
          </Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {userProfile.data.user.role !== 'USER' ? (
          <AdminDropdown />
        ) : (
          <UserDropdown />
        )}
        <Signout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
