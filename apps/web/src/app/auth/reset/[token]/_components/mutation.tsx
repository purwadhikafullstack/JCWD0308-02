import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { redirectSignin } from './action';
import { ResetPasswordSchema } from './validation';
import { IUserProfile } from '@/lib/types/user';

export const useSetAccount = (token: string) =>
  useMutation<
    { status: 'OK'; message: string, user: IUserProfile },
    { error: string, errors?: z.inferFlattenedErrors<typeof ResetPasswordSchema> },
    z.infer<typeof ResetPasswordSchema>
  >({
    mutationFn: async (data) => {
      try {
        const res = await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/auth/reset/${token}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        );

        if (!res.ok) throw await res.json();

        const response = await res.json()

        await redirectSignin(response.user);

        return response
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
