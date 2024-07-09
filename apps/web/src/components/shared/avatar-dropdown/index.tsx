'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Signout } from './signout';
import AdminDropdown from './admin-dropdown';
import UserDropdown from './user-dropdown';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const AvatarDropdown = () => {
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const pathname = usePathname();

  if (!userProfile.data?.user) {
    const searchParams = new URLSearchParams();

    if (pathname !== '/') searchParams.set('redirect', pathname);

    return (
      <>
        <Button asChild size={'sm'}>
          <Link href={`/auth/signin?${searchParams.toString()}`}>Signin</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="ml-auto rounded-full text-primary w-10 h-10 cursor-pointer">
          <AvatarImage
            asChild
            src={`${userProfile.data.user.avatarUrl}`}
            alt={userProfile.data.user.displayName.toUpperCase()}
            referrerPolicy="no-referrer"
          >
            <Image
              src={userProfile.data.user.avatarUrl}
              width={40}
              height={40}
              alt={userProfile.data.user.displayName.toUpperCase()}
              referrerPolicy="no-referrer"
            />
          </AvatarImage>
          <AvatarFallback>
            {userProfile.data.user.displayName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
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
