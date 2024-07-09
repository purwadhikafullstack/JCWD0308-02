import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { VerifyFormSchema } from './validation';
import { redirectSignin } from './action';


export const useSetAccount = (token: string) =>
  useMutation<
    { status: 'OK'; message: string },
    { error: string, errors?: z.inferFlattenedErrors<typeof VerifyFormSchema> },
    z.infer<typeof VerifyFormSchema>
  >({
    mutationFn: async (data) => {
      try {
        const res = await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/auth/verify/${token}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        );

        if (!res.ok) throw await res.json();

        await redirectSignin();

        return await res.json();
      } catch (error) {
        throw error;
      }
    },
    onError: async (error) => {
      if (!error.errors) {
        toast.error(error.error);
      }
    },
    onSuccess: async (data) => {
      toast.success(data.message);
    },
  });
