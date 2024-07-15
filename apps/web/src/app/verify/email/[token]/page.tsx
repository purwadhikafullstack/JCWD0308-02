import ChangeEmailPage from './_components/change-email';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Email Verification',
};

export default function VerifyPage({ params }: { params: { token: string } }) {
  return <ChangeEmailPage params={params} />;
}
