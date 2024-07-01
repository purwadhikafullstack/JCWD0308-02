import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Store } from '@/lib/types/store';
import Image from 'next/image';
import Link from 'next/link';

export default function StoreItem({ store }: { store: Store }) {
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
      <TableCell className="md:table-cell">
        <Badge className="text-xs" variant="secondary">
          {store.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
