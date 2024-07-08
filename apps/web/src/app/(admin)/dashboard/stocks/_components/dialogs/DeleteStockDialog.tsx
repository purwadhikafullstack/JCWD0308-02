import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { showSuccess, handleApiError } from '@/components/toast/toastutils';
import { Stock } from '@/lib/types/stock';
import { deleteStock } from '@/lib/fetch-api/stock';

interface DeleteStockDialogProps {
  stock: Stock;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const DeleteStockDialog: React.FC<DeleteStockDialogProps> = ({ stock, onClose, onDeleteSuccess }) => {
  const action = useMutation<
    { status: string; message: string; deletedStock: Stock | null },
    { error: string },
    string
  >({
    mutationFn: (stockId: string) => deleteStock(stockId),
    onSuccess: (data) => {
      showSuccess(`${data.deletedStock?.product.title || 'Stock'} in ${data.deletedStock?.store.name || 'store'} has been deleted!`);
      onClose();
      onDeleteSuccess();
    },
    onError: (error) => {
      handleApiError(error, 'Failed to delete stock');
      onClose();
    },
  });

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete Stock of <strong>{stock.product.title}</strong> in <strong>{stock.store.name}</strong>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete Stock of <strong>{stock.product.title}</strong> in <strong>{stock.store.name}</strong> and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={async () => {
              await action.mutateAsync(stock.id);
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStockDialog;
