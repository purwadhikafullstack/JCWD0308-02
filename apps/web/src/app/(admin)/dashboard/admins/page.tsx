"use client";
import React, { useEffect, useState } from 'react';
import { fetchUsers, updateUser, createUser, deleteUser } from '@/lib/fetch-api/user/client';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import EditForm from './_components/editform';
import CreateForm from './_components/createform';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { User } from '@/lib/types/user';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchUsers();
        setUsers(data.users.sort((a: User, b: User) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [updateFlag]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
  };

  const handleUpdate = async (id: string, updatedUser: Partial<User>) => {
    try {
      const { avatarUrl, password, ...userToUpdate } = updatedUser;
      await updateUser(id, userToUpdate);
      setSelectedUser(null);
      setUpdateFlag(prev => !prev);
      toast.success('User updated successfully', {
        className: 'bg-green-500 text-white',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user', {
        className: 'bg-red-500 text-white',
      });
    }
  };

  const handleCreate = async (newUser: Omit<User, 'id' | 'referralCode' | 'createdAt' | 'updatedAt'> & { password: string }) => {
    try {
      await createUser(newUser);
      setCreatingUser(false);
      setUpdateFlag(prev => !prev);
      toast.success('User created successfully', {
        className: 'bg-green-500 text-white',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user', {
        className: 'bg-red-500 text-white',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      toast.success('User deleted successfully', {
        className: 'bg-green-500 text-white',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user', {
        className: 'bg-red-500 text-white',
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <p>Manage your users here.</p>
      <div className="mt-4">
        <Button onClick={() => setCreatingUser(true)} className="mb-4 bg-green-500 text-white">Create User Admin</Button>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableCaption>A list of users in the system.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.displayName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.accountType}</TableCell>
                      <TableCell>{user.contactEmail}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>{user.referralCode}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="flex flex-col space-y-2">
                        <Button onClick={() => handleEdit(user)} className="bg-blue-500 text-white">Edit</Button>
                        <Button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {selectedUser && (
              <EditForm user={selectedUser} onUpdate={handleUpdate} onCancel={() => setSelectedUser(null)} />
            )}
            {creatingUser && (
              <CreateForm onCreate={handleCreate} onCancel={() => setCreatingUser(false)} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
