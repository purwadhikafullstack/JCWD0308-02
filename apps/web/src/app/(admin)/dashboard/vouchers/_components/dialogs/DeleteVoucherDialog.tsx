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
import { Voucher } from '@/lib/types/voucher';
import { deleteVoucher } from '@/lib/fetch-api/voucher';

interface DeleteVoucherDialogProps {
  voucher: Voucher;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const DeleteVoucherDialog: React.FC<DeleteVoucherDialogProps> = ({ voucher, onClose, onDeleteSuccess }) => {
  const action = useMutation<
    { status: string; message: string; deletedVoucher: Voucher | null },
    { error: string },
    string
  >({
    mutationFn: (voucherId: string) => deleteVoucher(voucherId),
    onSuccess: (data) => {
      showSuccess(`Voucher ${data.deletedVoucher?.name || 'Voucher'} has been deleted!`);
      onClose();
      onDeleteSuccess();
    },
    onError: (error) => {
      handleApiError(error, 'Failed to delete voucher');
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
              Are you sure you want to delete Voucher <strong>{voucher.name}</strong>?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete Voucher <strong>{voucher.name}</strong> and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async () => {
                await action.mutateAsync(voucher.id);
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

export default DeleteVoucherDialog;
