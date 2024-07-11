import React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { showSuccess, handleApiError } from '@/components/toast/toastutils';
import { Category } from '@/lib/types/category';
import { deleteCategory } from '@/lib/fetch-api/category/client';

interface DeleteCategoryDialogProps {
  category: Category;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({ category, onClose, onDeleteSuccess }) => {
  const action = useMutation<void, any, string>({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      showSuccess(`Category ${category.name} has been deleted!`);
      onClose();
      onDeleteSuccess();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      handleApiError(error, errorMessage);
      onClose();
    },
  });

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete Category <strong>{category.name}</strong>?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete Category <strong>{category.name}</strong> and remove product and stock that related to this category from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async () => {
                await action.mutateAsync(category.id);
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export default DeleteCategoryDialog;
