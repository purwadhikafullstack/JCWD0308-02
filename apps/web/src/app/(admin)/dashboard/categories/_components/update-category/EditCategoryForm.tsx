'use client';

import { Form, Submit, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { FormEvent } from 'react';

import { useUpdateCategoryForm } from '../validation/validation-category';
import { useUpdateCategory } from './mutation-update-category';
import FieldFile from '../fields/fieldFile';

import { Category } from '@/lib/types/category';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function EditCategoryForm({
  category,
  className,
  handleClose,
  onSave,
}: {
  className?: string;
  handleClose: () => void;
  category: Category;
  onSave: (id: string, formData: FormData) => void;
}) {
  const form = useUpdateCategoryForm({
    name: category.name,
    imageUrl: undefined,
  });

  const updateCategory = useUpdateCategory(handleClose, category);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave(category.id, formData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn('grid items-start gap-4 p-4 bg-white rounded shadow-md', className)}
        encType="multipart/form-data"
      >
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{updateCategory?.error?.errors?.fieldErrors?.name?.[0]}</FormMessage>
            </FormItem>
          )}
        />
        <FieldFile
          label="Image"
          name="imageUrl"
          form={form}
          errorMessage={updateCategory?.error?.errors?.fieldErrors?.imageUrl?.[0]}
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <Button type="submit" className="px-4 py-2 ">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
