import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { ButtonProps, Button as RawButton } from './button';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InputProps } from './input';
import { cn } from '@/lib/utils';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
    formState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(
        'cursor-pointer',
        error && 'text-destructive',
        className,
      )}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  const msg = children as string[];

  if (!body) {
    return null;
  }

  return (
    <>
      {body && msg?.length > 1 && msg[0] ? (
        <>
          {msg.map((p, i) => (
            <p
              key={i}
              ref={ref}
              id={formMessageId}
              className={cn('text-xs font-medium text-destructive', className)}
              {...props}
            >
              {p}
            </p>
          ))}
        </>
      ) : (
        <p
          ref={ref}
          id={formMessageId}
          className={cn('text-sm font-medium text-destructive', className)}
          {...props}
        >
          {body}
        </p>
      )}
    </>
  );
});
FormMessage.displayName = 'FormMessage';

const Submit = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, pending, pendingState, ...props }, ref) => {
    const { error, formState } = useFormField();
    const { isValid, isDirty } = formState;
    const [isHydrated, setIsHydrated] = React.useState(false);

    React.useEffect(() => setIsHydrated(true), []);

    const invalid =
      (error ? true : false) || ((!isDirty || !isValid) && isHydrated);

    const tooltipContent = invalid
      ? 'please input the fields'
      : pending
        ? pendingState || 'Submitting...'
        : children;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <RawButton
              ref={ref}
              className={cn(
                invalid &&
                  'disabled:pointer-events-auto disabled:cursor-not-allowed',
                pending && 'disabled:pointer-events-auto disabled:cursor-wait',
                className,
              )}
              disabled={pending || invalid}
              {...props}
            >
              {pending && pendingState ? pendingState : children}
              {/* {pending && (
                <svg
                  className="animate-spin -mr-1 ml-3 h-4 w-4 text-slate-50 dark:text-slate-950 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )} */}
            </RawButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);
Submit.displayName = 'Submit';

const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, pending, type, ...props }, ref) => {
    const { error } = useFormField();
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error &&
            'border-red-500 focus-visible:ring-red-500 ',
          className,
        )}
        ref={ref}
        disabled={pending}
        {...props}
      />
    );
  },
);
FormInput.displayName = 'FormInput';

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  Submit,
  FormInput,
};
