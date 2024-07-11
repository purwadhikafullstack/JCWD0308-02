import {
  changeEmailSchema,
  ChangeEmailValues,
} from '@/app/(home)/(settings)/_components/profile-form/validation';
import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { redirectToProfile } from './action';

export const useChangeEmail = (token: string) =>
  useMutation<
    { status: string; message: string },
    {
      error: string;
      errors: z.inferFlattenedErrors<typeof changeEmailSchema>;
    },
    ChangeEmailValues
  >({
    mutationFn: async (data) => {
      try {
        const res = await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/users/profile/email/${token}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        );

        if (!res.ok) throw await res.json();

        await redirectToProfile();

        return await res.json();
      } catch (error) {
        throw error;
      }
    },
    onSuccess(data, variables, context) {
      toast.success(data.message);
    },
    onError(error, variables, context) {
      toast.error('Failed to update your profile');
    },
  });
