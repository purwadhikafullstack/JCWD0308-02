import React from 'react';
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteUser } from '@/lib/fetch-api/user/client'; 
import { User } from '@/lib/types/user';
import { useMutation } from '@tanstack/react-query';
import { showSuccess, handleApiError } from '@/components/toast/toastutils';

export default function DeleteUserDialog({ user, onClose, onDeleteSuccess }: { user: User, onClose: () => void, onDeleteSuccess: () => void }) {
  const action = useMutation<
    {
      status: string;
      message: string;
      deletedUser: User | null;
    },
    { error: string },
    string
  >({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (data) => {
      showSuccess(`${data.deletedUser?.displayName || 'User'} has been deleted!`);
      onClose();
      onDeleteSuccess();
    },
    onError: (error) => {
      handleApiError(error, 'Failed to delete user');
      onClose();
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure want to delete {user.displayName}?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete {user.displayName} and remove their data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        <Button
          onClick={async () => {
            await action.mutateAsync(user.id);
          }}
          variant={'destructive'}
        >
          Delete
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
