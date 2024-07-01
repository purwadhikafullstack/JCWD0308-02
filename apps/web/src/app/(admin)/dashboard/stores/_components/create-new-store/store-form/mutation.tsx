import { Store } from '@/lib/types/store';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { FormSchema } from './validation';
import fetchAPI from '@/lib/fetchAPI';
import { env } from '@/app/env';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useCreateNewStore = (handleClose: () => void) => {
  const router = useRouter();
  
  return useMutation<
    { store: Store },
    { errors: z.inferFlattenedErrors<typeof FormSchema>; error: string },
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      try {
        const data = await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/stores`, {
          method: 'POST',
          body: formData,
        });

        if (!data.ok) throw await data.json();

        return await data.json();
      } catch (error) {
        // ✅ here, a failed Promise is returned
        throw error;
      }
    },
    onSuccess: (data) => {
      router.refresh()
      toast(`${data.store.name} store has been created!`, { duration: 4000 });
      handleClose();
      router.push(`/dashboard/stores/${data.store.id}`)
    },
    onError: (data) => {
      console.log('onError', data);

      toast.error('Failed to create new store!', {
        description: data.error,
        duration: 4000,
      });
      // handleClose();
    },
  });
};
