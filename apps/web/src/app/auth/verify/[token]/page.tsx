'use client';
import Link from 'next/link';
import { VerifyForm } from './_components/verify-form';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import fetchAPI from '@/lib/fetchAPI';
import { env } from '@/app/env';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyPage({ params }: { params: { token: string } }) {
  const checkToken = useSuspenseQuery({
    queryKey: ['verify-token'],
    queryFn: async () => {
      return (
        await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/auth/verify/${params.token}`,
        )
      ).json();
    },
  });

  if (checkToken?.data?.error)
    return <InvalidToken errorMessage={checkToken?.data?.error} />;

  if (checkToken?.data?.isTokenExpired)
    return <TokenExpired token={params.token} />;

  return (
    <div className="container relative h-full flex flex-col items-center justify-center ">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Set your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your name and password below to <br /> set your account
            </p>
          </div>
          <VerifyForm token={params.token} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function InvalidToken({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="container relative h-[inherit] flex flex-col items-center justify-center ">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {errorMessage}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenExpired({ token }: { token: string }) {
  const resend = useMutation<
    { isTokenExpired: boolean; message: string },
    { error: string }
  >({
    mutationFn: async () => {
      try {
        const res = await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/auth/verify/resend/${token}`,
          {
            method: 'POST',
          },
        );

        if (!res.ok) throw await res.json();

        return await res.json();
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      toast.error(error.error);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  const handleResend = async () => {
    await resend.mutateAsync();
  };

  return (
    <div className="container relative h-[inherit] flex flex-col items-center justify-center ">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[320px]">
          <div className="flex flex-col space-y-2 text-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Your link is expired!
            </h1>
            <Button
              disabled={Boolean(resend?.data?.message)}
              onClick={handleResend}
            >
              {' '}
              <Send className="mr-2 h-4 w-4" /> Resend Email Verification
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
