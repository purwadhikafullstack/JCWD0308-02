import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { SigninFormSchema } from './validation';
import { toast } from 'sonner';
import { IUserProfile } from '@/lib/types/user';
import { redirectSignin } from './action';

export const useSignin = () =>
  useMutation<
    { message: string; user: IUserProfile },
    { error: string; errors?: z.inferFlattenedErrors<typeof SigninFormSchema> },
    { data: z.infer<typeof SigninFormSchema>; redirect: string }
  >({
    mutationFn: async ({ data, redirect }) => {
      try {
        const res = await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/auth/signin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        );

        if (!res.ok) throw await res.json();

        const response = await res.json();

        await redirectSignin(response.user, redirect);

        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      if (!error.errors) {
        toast.error(error.error);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
