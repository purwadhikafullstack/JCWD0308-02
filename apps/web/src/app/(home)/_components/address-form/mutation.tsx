import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { FormSchema } from './validation';
import fetchAPI from '@/lib/fetchAPI';
import { env } from '@/app/env';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Address } from '@/lib/types/address';
import { useAppDispatch } from '@/lib/features/hooks';
import { fetchCart, fetchCartItemCount } from '@/lib/features/cart/cartSlice';

export const useCreateUserAddress = (handleClose: () => void) => {
  const router = useRouter();
  const dispatch = useAppDispatch();


  return useMutation<
    { address: Address },
    { errors: z.inferFlattenedErrors<typeof FormSchema>; error: string },
    z.input<typeof FormSchema>
  >({
    mutationFn: async (data: z.input<typeof FormSchema>) => {
      try {
        const res = await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/address`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw await res.json();

        return await res.json();
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      router.refresh();
      toast(`${data.address.labelAddress} address has been created!`, {
        duration: 4000,
      });
      handleClose();
      dispatch(fetchCart());
      dispatch(fetchCartItemCount());
    },
    onError: (data) => {
      toast.error('Failed to create new address!', {
        description: data.error,
        duration: 4000,
      });
    },
  });
};

export const useUpdateUserAddress = (
  handleClose: () => void,
  addressId: string,
) => {
  const router = useRouter();

  return useMutation<
    { address: Address },
    { errors: z.inferFlattenedErrors<typeof FormSchema>; error: string },
    z.input<typeof FormSchema>
  >({
    mutationFn: async (data: z.input<typeof FormSchema>) => {
      try {
        const res = await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/address/${addressId}`,
          {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!res.ok) throw await res.json();

        return await res.json();
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      router.refresh();
      toast(`${data.address.labelAddress} address has been created!`, {
        duration: 4000,
      });
      handleClose();
    },
    onError: (data) => {
      toast.error('Failed to create new address!', {
        description: data.error,
        duration: 4000,
      });
    },
  });
};

export const useDeleteUserAddress = () => {
  const router = useRouter();

  return useMutation<
    { address: Address; message: string },
    { errors: z.inferFlattenedErrors<typeof FormSchema>; error: string },
    string
  >({
    mutationFn: async (addressId) => {
      try {
        const res = await fetchAPI(
          `${env.NEXT_PUBLIC_BASE_API_URL}/address/${addressId}`,
          {
            method: 'DELETE',
          },
        );

        if (!res.ok) throw await res.json();

        return await res.json();
      } catch (error) {
        // ✅ here, a failed Promise is returned
        throw error;
      }
    },
    onSuccess: (data) => {
      router.refresh();
      toast(`${data.message}`, { duration: 4000 });
    },
    onError: (data) => {
      toast.error('Failed to delete address!', {
        description: data.error,
        duration: 4000,
      });
    },
  });
};
