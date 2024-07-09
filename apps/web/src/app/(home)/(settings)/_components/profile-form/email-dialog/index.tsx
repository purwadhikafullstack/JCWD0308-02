import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, Submit } from '@/components/ui/form';
import { AlertCircle } from 'lucide-react';
import { FormEvent, useState } from 'react';
import FieldPassword from './fields/password';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChangeEmailValues, useEmailForm } from '../validation';
import { useChangeEmailRequest } from '../mutation';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { FaSpinner } from 'react-icons/fa';
import FieldEmail from './fields/email';

export function EmailDialog() {
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [isShow, setIsShow] = useState(false);
  const form = useEmailForm({
    email: userProfile?.data?.user?.email || '',
    newEmail: '',
    password: '',
  });

  const changeEmailRequest = useChangeEmailRequest(handleClose);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as ChangeEmailValues;

    await changeEmailRequest.mutateAsync(data);
    form.reset();
  }

  if (!userProfile?.data?.user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Email</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Email</DialogTitle>
          <DialogDescription>
            Make changes to your Email here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4 py-4" onSubmit={onSubmit}>
            <FieldEmail form={form} type="email" errorMessage={undefined} />
            <FieldEmail form={form} type="newEmail" errorMessage={undefined} />
            <FieldPassword
              type="password"
              form={form}
              isShow={isShow}
              setIsShow={setIsShow}
              errorMessage={undefined}
            />
            {changeEmailRequest?.error?.error &&
            !changeEmailRequest?.error?.errors ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {changeEmailRequest?.error?.error}
                </AlertDescription>
              </Alert>
            ) : null}
            <Submit type="submit" pending={changeEmailRequest.isPending}>
              {changeEmailRequest.isPending && (
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Submit>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
