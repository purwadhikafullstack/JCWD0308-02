'use client';

import { Form, Submit, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { FormEvent } from 'react';
import { useCategoryForm } from '../validation/validation-category';
import { useCreateNewCategory } from './mutation-create-category';
import FieldFile from '../fields/fieldFile';
import { Input } from '@/components/ui/input';

export function CreateCategoryForm({
  className,
  handleClose,
  onSave,
}: {
  className?: string;
  handleClose: () => void;
  onSave: (formData: FormData) => void;
}) {
  const form = useCategoryForm();
  const createNewCategory = useCreateNewCategory(handleClose);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave(formData);
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
              <FormMessage>{createNewCategory?.error?.errors?.fieldErrors?.name?.[0]}</FormMessage>
            </FormItem>
          )}
        />
        <FieldFile
          label="Icon"
          name="iconUrl"
          form={form}
          errorMessage={createNewCategory?.error?.errors?.fieldErrors?.iconUrl?.[0]}
        />
        <FieldFile
          label="Image"
          name="imageUrl"
          form={form}
          errorMessage={createNewCategory?.error?.errors?.fieldErrors?.imageUrl?.[0]}
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <Submit type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Submit
          </Submit>
        </div>
      </form>
    </Form>
  );
}
