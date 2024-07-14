import { protectedRoute } from '@/lib/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await protectedRoute.user();

  return <>{children}</>;
}
