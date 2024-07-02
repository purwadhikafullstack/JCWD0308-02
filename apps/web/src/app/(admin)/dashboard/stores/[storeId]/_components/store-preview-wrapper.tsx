'use client';
import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import { Store } from '@/lib/types/store';
import { useSuspenseQuery } from '@tanstack/react-query';
import StorePreview from '../../_components/store-preview';

export default function StorePreviewWrapper({
  storeId,
  cookie,
}: {
  storeId: string;
  cookie: string;
}) {
  const store = useSuspenseQuery({
    queryKey: ['store', storeId],
    queryFn: async (): Promise<{ store: Store | null }> =>
      (
        await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/stores/${storeId}`, {
          headers: { Cookie: cookie },
        })
      ).json(),
  });

  return <StorePreview store={store?.data?.store!} />;
}
