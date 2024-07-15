'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { FaSpinner } from 'react-icons/fa';
import { z } from 'zod';
import { Form, Submit } from '@/components/ui/form';
import { VerifyFormSchema, useVerifyForm } from './validation';
import { useSuspenseQuery } from '@tanstack/react-query';
import fetchAPI from '@/lib/fetchAPI';
import { env } from '@/app/env';
import FieldEmail from './fields/email';
import FieldName from './fields/name';
import FieldPassword from './fields/password';
import FieldRegisterCode from './fields/register-code';
import { useSetAccount } from './mutation';

interface VerifyFormProps extends React.HTMLAttributes<HTMLDivElement> {
  token: string;
}

export function VerifyForm({ className, token, ...props }: VerifyFormProps) {
  const [isShow, setIsShow] = React.useState(false);

  const checkToken = useSuspenseQuery({
    queryKey: ['verify-token'],
    queryFn: async () => {
      return (
        await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/auth/verify/${token}`)
      ).json();
    },
  });

  const form = useVerifyForm({
    email: checkToken?.data?.user?.email || '',
    displayName: '',
    password: '',
    confirmPassword: '',
    registerCode: '',
  });

  const setAccount = useSetAccount(token);

  async function onSubmit(values: z.infer<typeof VerifyFormSchema>) {
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
              <FieldName
                form={form}
                errorMessage={
                  setAccount?.error?.errors?.fieldErrors?.displayName
                }
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
              <FieldRegisterCode
                form={form}
                errorMessage={
                  setAccount?.error?.errors?.fieldErrors?.registerCode
                }
              />
            </div>
            <Submit pending={setAccount.isPending}>
              {setAccount.isPending && (
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue
            </Submit>
          </div>
        </form>
      </Form>
    </div>
  );
}
