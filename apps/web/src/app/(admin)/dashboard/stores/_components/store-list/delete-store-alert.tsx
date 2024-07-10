import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteStore } from '@/lib/fetch-api/store/client';
import { Store } from '@/lib/types/store';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeleteStoreDialog({ store }: { store: Store }) {
  const router = useRouter()
  const action = useMutation<
    {
      status: string;
      message: string;
      deletedStore: Store | null;
      storeFallback: Store | null;
    },
    { error: string },
    string
  >({
    mutationFn: (storeId: string) => deleteStore(storeId),
    onSuccess: (data) => {
      router.refresh()
      toast(`${data.deletedStore?.name} store has been deleted!`, { duration: 4000 });
    },
    onError: (data) => {

      toast.error(data.error, {
        description: data.error,
        duration: 4000,
      });
    },
  });
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure want to delete {store.name}?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete{' '}
          {store.name} and remove {store.name} data, orders, stocks etc from our
          servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          onClick={async () => {
            await action.mutateAsync(store.id);
          }}
          variant={'destructive'}
        >
          Delete
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
