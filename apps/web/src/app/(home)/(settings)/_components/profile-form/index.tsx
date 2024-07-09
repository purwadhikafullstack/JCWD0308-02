'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { useProfileForm } from './validation';
import { useUpdateProfile } from './mutation';
import { FormEvent } from 'react';
import { PasswordDialog } from './password-dialog';
import { EmailDialog } from './email-dialog';
import { FaSpinner } from 'react-icons/fa';

export function ProfileForm() {
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const updateProfile = useUpdateProfile();

  const form = useProfileForm({
    displayName: userProfile?.data?.user?.displayName || '',
    email: userProfile?.data?.user?.email || '',
  });

  if (!userProfile?.data?.user) {
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateProfile.mutateAsync(formData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
        encType="multipart/form-data"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Image</FormLabel>
              <FormControl>
                <div className="flex items-center justify-between">
                  <Avatar className="h-28 w-28">
                    <AvatarImage
                      asChild
                      src={`${userProfile?.data?.user.avatarUrl}`}
                      alt={userProfile?.data?.user.displayName.toUpperCase()}
                      referrerPolicy="no-referrer"
                    >
                      <Image
                        src={userProfile?.data?.user.avatarUrl!}
                        width={112}
                        height={112}
                        alt={userProfile?.data?.user.displayName.toUpperCase()!}
                        referrerPolicy="no-referrer"
                      />
                    </AvatarImage>
                    <AvatarFallback>
                      {userProfile?.data?.user?.displayName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    className="w-min"
                    accept="gif,.jpg,.jpeg,.png"
                    type="file"
                    {...form.register('file')}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {userProfile?.data?.user?.accountType === 'EMAIL' ? (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="opacity-60">Email</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-4">
                      <FormInput
                        className="disabled:opacity-60 "
                        disabled
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        value={field.value}
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        {...form.register('email')}
                      />
                      <EmailDialog />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="opacity-60">Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-4">
                      <FormInput
                        className="disabled:opacity-60 "
                        disabled
                        id="password"
                        placeholder="*****"
                        type="password"
                        value={field.value}
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        {...form.register('password')}
                      />
                      <PasswordDialog />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        ) : null}
        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending && (
            <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update profile
        </Button>
      </form>
    </Form>
  );
}
