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
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ResetPasswordSchema } from '../validation';

export default function FieldPassword({
  errorMessage,
  form,
  type,
  isShow,
  setIsShow
}: {
  type: 'password' | 'confirmPassword';
  form: UseFormReturn<z.input<typeof ResetPasswordSchema>>;
  errorMessage: string[] | string | undefined;
  isShow: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <FormField
      control={form.control}
      name={type}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
           New {type === 'password' ? 'Password' : 'Confirm Password'}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <FormInput
                placeholder="******"
                type={isShow ? 'text' : 'password'}
                value={field.value}
                {...form.register(type)}
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
          <FormMessage>
            {typeof errorMessage !== 'string' && errorMessage}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
