import React from 'react';
import { User } from '@/lib/types/user';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import DeleteUserDialog from '../dialogs/DeleteAlert';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User | null) => void;
  deletingUser: User | null;
  removeUserFromState: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, deletingUser, removeUserFromState }) => (
  <div className="w-full overflow-x-auto">
    <Table className="min-w-full divide-y divide-gray-200">
      <TableCaption>A list of users in the system.</TableCaption>
      <TableHeader>
        <TableRow >
          <TableHead className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-20">Name</TableHead>
          <TableHead className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-40">Email</TableHead>
          <TableHead className="hidden lg:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-40">Contact Email</TableHead>
          <TableHead className="hidden md:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-20">Role</TableHead>
          <TableHead className="hidden md:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-20">Status</TableHead>
          <TableHead className="hidden xl:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-40">Referral Code</TableHead>
          <TableHead className="hidden xl:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-40">Created At</TableHead>
          <TableHead className="hidden xl:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-40">Updated At</TableHead>
          <TableHead className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-20">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-20">{user.displayName}</TableCell>
            <TableCell className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-40">{user.email}</TableCell>
            <TableCell className="hidden lg:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-40">{user.contactEmail}</TableCell>
            <TableCell className="hidden md:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-20">{user.role}</TableCell>
            <TableCell className="hidden md:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-20">{user.status}</TableCell>
            <TableCell className="hidden xl:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-40">{user.referralCode}</TableCell>
            <TableCell className="hidden xl:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-40">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="hidden xl:table-cell px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-40">{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
            <TableCell className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-20 flex flex-col space-y-2">
              <Button onClick={() => onEdit(user)} >Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" onClick={() => onDelete(user)}>Delete</Button>
                </AlertDialogTrigger>
                {deletingUser && deletingUser.id === user.id && (
                  <DeleteUserDialog
                    user={deletingUser}
                    onClose={() => onDelete(null)}
                    onDeleteSuccess={() => removeUserFromState(user.id)}
                  />
                )}
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default UserTable;
