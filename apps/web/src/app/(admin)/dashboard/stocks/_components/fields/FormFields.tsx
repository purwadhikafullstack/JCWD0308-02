"use client"
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';

const FormFields: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <>
      <div className="mb-4">
        <Label>Amount</Label>
        <Input 
          type="number" 
          {...register('amount', { required: 'Amount is required', valueAsNumber: true })} 
          className="mt-1 w-full rounded-md"
        />
        {errors.amount && <FormMessage>{String(errors.amount.message)}</FormMessage>}
      </div>
      <div className="mb-4">
        <Label>Description</Label>
        <Textarea 
          {...register('description')} 
          className="mt-1 w-full rounded-md"
        />
        {errors.description && <FormMessage>{String(errors.description.message)}</FormMessage>}
      </div>
    </>
  );
};

export default FormFields;