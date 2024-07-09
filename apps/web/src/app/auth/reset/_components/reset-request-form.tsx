'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { FaSpinner } from 'react-icons/fa';
import { z } from 'zod';
import { Form, Submit } from '@/components/ui/form';
import { useResetRequest } from './mutation';
import { ResetRequestSchema, useResetRequestForm } from './validation';
import FieldEmail from './email';
import { Send } from 'lucide-react';

interface ResetRequestProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResetRequestForm({ className, ...props }: ResetRequestProps) {
  const form = useResetRequestForm();

  const reset = useResetRequest();

  async function onSubmit(values: z.infer<typeof ResetRequestSchema>) {
    await reset.mutateAsync(values);
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
                  reset?.error?.errors
                    ? reset?.error?.errors?.fieldErrors?.email
                    : reset?.error?.error
                }
              />
            </div>
            <Submit pending={reset.isPending}>
              {reset.isPending ? (
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send password reset email
            </Submit>
          </div>
        </form>
      </Form>
    </div>
  );
}
