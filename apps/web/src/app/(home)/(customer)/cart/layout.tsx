import { protectedRoute } from '@/lib/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await protectedRoute.user();
  // console.log(auth);

  return <>{children}</>;
}
