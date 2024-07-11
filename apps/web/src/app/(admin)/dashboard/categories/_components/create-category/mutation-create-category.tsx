import { Category } from '@/lib/types/category';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import fetchAPI from '@/lib/fetchAPI';
import { env } from '@/app/env';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { FormSchema } from '../validation/validation-category';

export const useCreateNewCategory = (handleClose: () => void) => {
  const router = useRouter();
  
  return useMutation<
    { category: Category },
    { errors: z.inferFlattenedErrors<typeof FormSchema>; error: string },
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      try {
        const data = await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/categories`, {
          method: 'POST',
          body: formData,
        });

        if (!data.ok) throw await data.json();

        return await data.json();
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      router.refresh();
      toast(`${data.category.name} category has been created!`, { duration: 4000 });
      handleClose();
      router.push(`/dashboard/categories/${data.category.id}`);
    },
    onError: (data) => {
      toast.error('Failed to create new category!', {
        description: data.error,
        duration: 4000,
      });
    },
  });
};
