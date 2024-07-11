import Link from 'next/link';
import { SigninForm } from './_components/signin-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signin',
}

export default function Signin() {
  return (
    <div className="container relative h-[inherit] flex flex-col items-center justify-center ">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to Grosirun
            </h1>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                className="text-primary hover:underline"
                href={'/auth/signup'}
              >
                Sign Up
              </Link>
            </p>
          </div>
          <SigninForm />
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
