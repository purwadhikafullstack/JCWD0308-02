'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FaGithub, FaGoogle, FaSpinner } from 'react-icons/fa';
import { SignupFormSchema, useSignupForm } from './validation';
import { z } from 'zod';
import { Form, Submit } from '@/components/ui/form';
import FieldEmail from './email';
import { useSignup } from './mutation';
import Link from 'next/link';
import { env } from '@/app/env';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useSignupForm();

  const signup = useSignup();

  async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    await signup.mutateAsync(values);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FieldEmail
                form={form}
                errorMessage={
                  signup?.error?.errors
                    ? signup?.error?.errors?.fieldErrors?.email
                    : signup?.error?.error
                }
              />
            </div>
            <Submit pending={signup.isPending}>
              {signup.isPending && (
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up with Email
            </Submit>
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
          className="w-full flex p-0 items-center justify-center"
          type="button"
          disabled={signup.isPending}
        >
          <Link
            className="flex items-center justify-center w-full text-center"
            href={`${env.NEXT_PUBLIC_BASE_API_URL}/auth/github`}
          >
            {signup.isPending ? (
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FaGithub className="mr-2 h-4 w-4" />
            )}{' '}
            GitHub
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full flex p-0 items-center justify-center"
          type="button"
          disabled={signup.isPending}
        >
          <Link
            className="flex items-center justify-center w-full text-center"
            href={`${env.NEXT_PUBLIC_BASE_API_URL}/auth/google`}
          >
            {signup.isPending ? (
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
