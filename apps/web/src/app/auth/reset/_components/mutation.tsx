import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { ResetRequestSchema } from './validation';

export const useResetRequest = () =>
  useMutation<
    { message: string },
    { error: string; errors?: z.inferFlattenedErrors<typeof ResetRequestSchema> },
    z.infer<typeof ResetRequestSchema>
  >({
    mutationFn: async (data) => {
      try {
        const res = await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/auth/reset`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        );

        if (!res.ok) throw await res.json();

        return await res.json();
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
      toast.success(data.message)
    }
  });
