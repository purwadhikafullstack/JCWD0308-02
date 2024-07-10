'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { FaSpinner } from 'react-icons/fa';
import { Form, Submit } from '@/components/ui/form';
import { useSuspenseQuery } from '@tanstack/react-query';
import fetchAPI from '@/lib/fetchAPI';
import { env } from '@/app/env';
import {
  ChangeEmailValues,
  useEmailForm,
} from '@/app/(home)/(settings)/_components/profile-form/validation';
import { useChangeEmail } from './mutation';
import FieldEmail from '@/app/(home)/(settings)/_components/profile-form/email-dialog/fields/email';
import FieldPassword from '@/app/(home)/(settings)/_components/profile-form/email-dialog/fields/password';

interface VerifyFormProps extends React.HTMLAttributes<HTMLDivElement> {
  token: string;
}

export function VerifyForm({ className, token, ...props }: VerifyFormProps) {
  const [isShow, setIsShow] = React.useState(false);

  const checkToken = useSuspenseQuery({
    queryKey: ['email-token'],
    queryFn: async () => {
      return (
        await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/auth/verify/${token}`)
      ).json();
    },
  });

  const form = useEmailForm({
    email: checkToken?.data?.user?.email || '',
    newEmail: checkToken?.data?.newToken?.newEmail || '',
    password: '',
  });

  const changeEmail = useChangeEmail(token);

  async function onSubmit(values: ChangeEmailValues) {
    await changeEmail.mutateAsync(values);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <FieldEmail
                type="email"
                form={form}
                errorMessage={changeEmail?.error?.errors?.fieldErrors?.email}
              />
              <FieldEmail
                type="newEmail"
                form={form}
                disabled
                errorMessage={changeEmail?.error?.errors?.fieldErrors?.email}
              />
              <FieldPassword
                type="password"
                isShow={isShow}
                setIsShow={setIsShow}
                form={form}
                errorMessage={changeEmail?.error?.errors?.fieldErrors?.email}
              />
            </div>
            <Submit pending={changeEmail.isPending}>
              {changeEmail.isPending && (
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
