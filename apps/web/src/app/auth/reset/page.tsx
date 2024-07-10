import { Metadata } from 'next';
import { ResetRequestForm } from './_components/reset-request-form';

export const metadata: Metadata = {
  title: 'Forgot Password Request',
}

export default function ResetPage() {
  return (
    <div className="container relative h-[inherit] flex flex-col items-center justify-center ">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to send email reset password
            </p>
          </div>
          <ResetRequestForm />
        </div>
      </div>
    </div>
  );
}
