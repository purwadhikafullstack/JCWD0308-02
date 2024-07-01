import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Store } from '@/lib/types/store';
import { User } from '@/lib/types/user';
import Image from 'next/image';
import Link from 'next/link';

export default function StoreAdminItem({ user }: { user: User }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-4">
          <Image
            src={user.avatarUrl!}
            alt="Store image"
            width={64}
            height={64}
            className="aspect-square rounded-md object-cover"
          />
          <div className="font-medium">{user.displayName}</div>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell className="hidden xl:table-cell">
        <Badge className="text-xs" variant="secondary">
          {user.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
