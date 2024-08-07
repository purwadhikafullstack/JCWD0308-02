'use client';
import { useSuspenseQuery } from '@tanstack/react-query';
import fetchAPI from '@/lib/fetchAPI';
import { env } from '@/app/env';
import { ResetForm } from './_components/reset-form';

export default function VerifyPage({ params }: { params: { token: string } }) {
  const checkToken = useSuspenseQuery({
    queryKey: ['reset-token'],
    queryFn: async () => {
      return (
        await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/auth/reset/${params.token}`,
        )
      ).json();
    },
  });

  if (checkToken?.data?.error)
    return <InvalidToken errorMessage={checkToken?.data?.error} />;

  if (checkToken?.data?.isTokenExpired) return <TokenExpired />;

  return (
    <div className="container relative h-full flex flex-col items-center justify-center ">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password below to <br /> set reset your password
            </p>
          </div>
          <ResetForm token={params.token} />
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

function TokenExpired() {
  return (
    <div className="container relative h-[inherit] flex flex-col items-center justify-center ">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[320px]">
          <div className="flex flex-col space-y-2 text-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Your link is expired!
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
