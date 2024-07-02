import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { deleteStore } from '@/lib/fetch-api/store/client';
import { Store } from '@/lib/types/store';
import { useMutation } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const DeleteStoreDialog = dynamic(() => import('./delete-store-alert'));

export default function StoreItem({ store }: { store: Store }) {
  const [open, setOpen] = useState(false);
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-4">
          <Image
            src={store.imageUrl}
            alt="Store image"
            width={64}
            height={64}
            className="aspect-square rounded-md object-cover"
          />
          <Link href={`/dashboard/stores/${store.id}`}>
            <div className="font-medium">{store.name}</div>
          </Link>
        </div>
      </TableCell>

      <TableCell className="hidden xl:table-cell">
        <Badge className="text-xs" variant="secondary">
          {store.status}
        </Badge>
      </TableCell>

      <TableCell>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-destructive">
              Delete
            </Button>
          </AlertDialogTrigger>
          {open ? <DeleteStoreDialog store={store} /> : null}
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
