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
import { ChangePasswordValues, usePasswordForm } from '../validation';
import { AlertCircle } from 'lucide-react';
import { FormEvent, useState } from 'react';
import FieldPassword from './fields/password';
import { useChangePassword } from '../mutation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaSpinner } from 'react-icons/fa';

export function PasswordDialog() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [isShow, setIsShow] = useState(false);
  const form = usePasswordForm({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const changePassword = useChangePassword(handleClose);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as ChangePasswordValues;

    await changePassword.mutateAsync(data);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Password</DialogTitle>
          <DialogDescription>
            Make changes to your Password here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4 py-4" onSubmit={onSubmit}>
            <FieldPassword
              type="password"
              form={form}
              isShow={isShow}
              setIsShow={setIsShow}
              errorMessage={undefined}
            />
            <FieldPassword
              type="newPassword"
              form={form}
              isShow={isShow}
              setIsShow={setIsShow}
              errorMessage={undefined}
            />
            <FieldPassword
              type="confirmPassword"
              form={form}
              isShow={isShow}
              setIsShow={setIsShow}
              errorMessage={undefined}
            />
            {changePassword?.error?.error && !changePassword?.error?.errors ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {changePassword?.error?.error}
                </AlertDescription>
              </Alert>
            ) : null}
            <Submit type="submit" pending={changePassword.isPending}>
              {changePassword.isPending && (
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
