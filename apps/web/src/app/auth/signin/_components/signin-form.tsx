'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FaGithub, FaGoogle, FaSpinner } from 'react-icons/fa';
import { z } from 'zod';
import { Form, Submit } from '@/components/ui/form';
import FieldEmail from './email';
import Link from 'next/link';
import { env } from '@/app/env';
import { SigninFormSchema, useSigninForm } from './validation';
import { useSignin } from './mutation';
import FieldPassword from './password';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface SigninFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SigninForm({ className, ...props }: SigninFormProps) {
  const searchParams = useSearchParams();
  const [isShow, setIsShow] = React.useState(false);
  const form = useSigninForm();

  const signin = useSignin();

  async function onSubmit(values: z.infer<typeof SigninFormSchema>) {
    const redirect = searchParams.get('redirect');
    await signin.mutateAsync({ data: values, redirect: redirect || '/' });
  }

  function ErrorAlert() {
    if (!signin?.error?.error) return null;

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{signin?.error?.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3">
            <div className="grid gap-2">
              <FieldEmail
                form={form}
                errorMessage={
                  signin?.error?.errors
                    ? signin?.error?.errors?.fieldErrors?.email
                    : signin?.error?.error
                }
              />
              <FieldPassword
                isShow={isShow}
                setIsShow={setIsShow}
                form={form}
                errorMessage={signin?.error?.errors?.fieldErrors?.password}
              />
            </div>
            <Submit pending={signin.isPending}>
              {signin.isPending && (
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Submit>
            <ErrorAlert />
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 w-full">
        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={signin.isPending}
          asChild
        >
          <Link href={`${env.NEXT_PUBLIC_BASE_API_URL}/auth/github`}>
            {signin.isPending ? (
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FaGithub className="mr-2 h-4 w-4" />
            )}{' '}
            GitHub
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={signin.isPending}
          asChild
        >
          <Link href={`${env.NEXT_PUBLIC_BASE_API_URL}/auth/google`}>
            {signin.isPending ? (
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FaGoogle className="mr-2 h-4 w-4" />
            )}{' '}
            Google
          </Link>
        </Button>
      </div>
    </div>
  );
}
