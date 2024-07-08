import React from 'react';
import {
  AlertDialog,
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
import { deleteProduct } from '@/lib/fetch-api/product';
import { Product } from '@/lib/types/product';
import { handleApiError, showSuccess } from '@/components/toast/toastutils';

interface DeleteProductDialogProps {
  product: Product;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({ product, onClose, onDeleteSuccess }) => {
  const mutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      showSuccess('Product deleted successfully');
      onDeleteSuccess();
      onClose();
    },
    onError: (error) => {
      handleApiError(error, 'Failed to delete product');
      onClose();
    },
  });

  const handleDelete = async () => {
    await mutation.mutateAsync(product.id);
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete the product &quot;{product.title}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
