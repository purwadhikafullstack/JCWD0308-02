import {
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Dispatch, SetStateAction } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { SigninFormSchema } from './validation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function FieldPassword({
  errorMessage,
  form,
  isShow,
  setIsShow,
}: {
  form: UseFormReturn<z.input<typeof SigninFormSchema>>;
  errorMessage: string[] | string | undefined;
  isShow: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <FormField
      control={form.control}
      name={'password'}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <div className="relative">
              <FormInput
                placeholder="******"
                type={isShow ? 'text' : 'password'}
                value={field.value}
                {...form.register('password')}
              />
              <Button
                type="button"
                onClick={() => setIsShow((show) => (show ? false : true))}
                className="absolute inset-y-0 right-0 rounded-r-md"
                size="icon"
                variant="ghost"
              >
                <Eye className="h-5 w-5" />
              </Button>
            </div>
          </FormControl>
          <Link className={cn(buttonVariants({size: 'sm', variant: 'link'}), 'pl-0 text-primary/80')} href="/auth/reset">Forgot password?</Link>
          <FormMessage>
            {typeof errorMessage !== 'string' && errorMessage}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
