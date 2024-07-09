'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { signout } from '@/lib/fetch-api/user/client';
import { useMutation } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const Signout = () => {
  const router = useRouter()
  const { mutateAsync } = useMutation<{ message: string }, { error: string }>({
    mutationFn: async () => {
      try {
        const res = await signout();

        if (!res.ok) throw await res.json();

        const data = await res.json();

        router.refresh()
        router.replace('/auth/signin')

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.error);
    },
  });
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await mutateAsync();
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
