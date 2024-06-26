'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { signout } from '@/lib/fetch-api/user/client';
import { useMutation } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Signout = () => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: signout,
    onSuccess: () => {
      router.push('/auth/signin');
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate();
      }}
      className="flex-1"
      method="POST"
      action="/signout"
    >
      <button
        className="w-full flex-1 text-start"
        type="submit"
        name="_action"
        value={'signout'}
      >
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </button>
    </form>
  );
};
