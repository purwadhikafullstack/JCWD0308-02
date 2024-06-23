import React from 'react';
import { protectedRoute } from '@/lib/auth';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await protectedRoute.noAuthOnly();

  console.log(session);

  return <>{children}</>;
};

export default AuthLayout;
