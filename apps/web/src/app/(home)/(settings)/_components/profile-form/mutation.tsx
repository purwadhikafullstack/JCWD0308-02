import { env } from '@/app/env';
import fetchAPI from '@/lib/fetchAPI';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  changeEmailSchema,
  ChangeEmailValues,
  changePasswordSchema,
  ChangePasswordValues,
  profileFormSchema,
} from './validation';
import { z } from 'zod';

export const useUpdateProfile = () =>
  useMutation<
    { status: string; message: string },
    { error: string; errors: z.inferFlattenedErrors<typeof profileFormSchema> },
    FormData
  >({
    mutationFn: async (data) => {
      try {
        const res = await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/users/profile`,
          {
            method: 'PATCH',
            body: data,
          },
        );

        if (!res.ok) throw await res.json();

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

export const useChangePassword = (handleClose: () => void) =>
  useMutation<
    { status: string; message: string },
    {
      error: string;
      errors: z.inferFlattenedErrors<typeof changePasswordSchema>;
    },
    ChangePasswordValues
  >({
    mutationFn: async (data) => {
      try {
        const res = await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/users/profile/password`,
          {
            method: 'PATCH',
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
    onSuccess(data, variables, context) {
      toast.success(data.message);
      handleClose();
    },
    onError(error, variables, context) {
      toast.error('Failed to update your profile');
    },
  });

export const useChangeEmailRequest = (handleClose: () => void) =>
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
          `${env.NEXT_PUBLIC_BASE_API_URL}/users/profile/email`,
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
    onSuccess(data, variables, context) {
      toast.success(data.message);
      handleClose();
    },
    onError(error, variables, context) {
      toast.error('Failed to update your profile');
    },
  });
