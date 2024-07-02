import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSelectedAddress } from '@/lib/fetch-api/address/client';
import { Address } from '@/lib/types/address';
import { cn } from '@/lib/utils';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { changeAddress } from './action';
import { Edit, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteUserAddress } from './address-form/mutation';

export default function AddressItem({
  address,
  setActiveTab,
  setAddressId,
}: {
  address: Address;
  setAddressId: React.Dispatch<React.SetStateAction<string>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data } = useSuspenseQuery({
    queryKey: ['selected-address'],
    queryFn: getSelectedAddress,
  });

  const handleChangeAddress = useMutation({
    mutationFn: async (addressId: string) => {
      await changeAddress(addressId);
    },
  });

  const deleteAddress = useDeleteUserAddress();

  const handleDelete = async () => {
    await deleteAddress.mutateAsync(address.id);
  };

  return (
    <Card
      className={cn(
        'flex items-center justify-between',
        address.id === data?.address?.id ? 'border-primary' : '',
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardDescription>{address.labelAddress}</CardDescription>
          <Button
            onClick={() => {
              setAddressId(() => address.id);
              setActiveTab(() => `edit-address-${address.id}`);
            }}
            variant={'ghost'}
            size={'icon'}
            className="h-3 w-3 text-primary"
          >
            <Edit />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={'ghost'}
                size={'icon'}
                className="h-3 w-3 text-destructive"
              >
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure want to delete {address.labelAddress} address?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{' '}
                  {address.labelAddress} from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant={'destructive'} onClick={handleDelete}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardTitle>{address.recipientName}</CardTitle>
        <CardDescription>{address.phone}</CardDescription>
        <CardDescription>{address.address}</CardDescription>
      </CardHeader>
      {address.id !== data?.address?.id ? (
        <CardHeader>
          <Button
            onClick={async () => {
              await handleChangeAddress.mutateAsync(address.id);
            }}
            variant={'outline'}
            className="text-primary/80 border-primary/80 hover:text-primary hover:border-primary"
          >
            Select
          </Button>
        </CardHeader>
      ) : null}
    </Card>
  );
}
