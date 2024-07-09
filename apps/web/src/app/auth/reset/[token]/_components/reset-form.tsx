'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { FaSpinner } from 'react-icons/fa';
import { z } from 'zod';
import { Form, Submit } from '@/components/ui/form';
import { useSuspenseQuery } from '@tanstack/react-query';
import fetchAPI from '@/lib/fetchAPI';
import { env } from '@/app/env';
import FieldEmail from './fields/email';
import FieldPassword from './fields/password';
import { useSetAccount } from './mutation';
import { ResetPasswordSchema, useResetPassword } from './validation';

interface ResetFormProps extends React.HTMLAttributes<HTMLDivElement> {
  token: string;
}

export function ResetForm({ className, token, ...props }: ResetFormProps) {
  const [isShow, setIsShow] = React.useState(false);

  const checkToken = useSuspenseQuery({
    queryKey: ['reset-token'],
    queryFn: async () => {
      return (
        await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/auth/reset/${token}`)
      ).json();
    },
  });

  const form = useResetPassword({
    email: checkToken?.data?.user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const setAccount = useSetAccount(token);

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    await setAccount.mutateAsync(values);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <FieldEmail
                form={form}
                errorMessage={setAccount?.error?.errors?.fieldErrors?.email}
              />
              <FieldPassword
                isShow={isShow}
                setIsShow={setIsShow}
                type="password"
                form={form}
                errorMessage={setAccount?.error?.errors?.fieldErrors?.password}
              />
              <FieldPassword
                isShow={isShow}
                setIsShow={setIsShow}
                type="confirmPassword"
                form={form}
                errorMessage={
                  setAccount?.error?.errors?.fieldErrors?.confirmPassword
                }
              />
            </div>
            <Submit pending={setAccount.isPending}>
              {setAccount.isPending && (
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reset password
            </Submit>
          </div>
        </form>
      </Form>
    </div>
  );
}
