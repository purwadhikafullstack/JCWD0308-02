"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
import SearchBar from '@/components/partial/SearchBar';
import Pagination from '@/components/partial/pagination';

const Users = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchUsers({ page, limit, search: searchQuery });
        setUsers(data.users.sort((a: User, b: User) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setTotalUsers(data.total);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [updateFlag, page, limit, searchQuery]);

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
      setUpdateFlag(prev => !prev);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset page to 1 when new search is made
    updateUrl({ search: query, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ search: searchQuery, page: newPage });
  };

  const updateUrl = ({ search, page }: { search: string, page: number }) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', page.toString());
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  useEffect(() => {
    const query = searchParams.get('search');
    const pageParam = searchParams.get('page');
    if (query) {
      setSearchQuery(query);
    }
    if (pageParam) {
      setPage(parseInt(pageParam, 10));
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4">
      <h2 className="flex text-2xl font-bold mb-4 text-primary items-center">Users</h2>
      <p>Manage your users here.</p>
      <div className="mt-4 mb-4">
        <Button onClick={() => setCreatingUser(true)} className="mb-4">Create User Admin</Button>
        <SearchBar onSearch={handleSearch} />
      </div>
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
                      <Button onClick={() => handleEdit(user)}>Edit</Button>
                      <Button onClick={() => handleDelete(user.id)} variant="destructive">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination
            total={totalUsers}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
          />
          {selectedUser && (
            <EditForm user={selectedUser} onUpdate={handleUpdate} onCancel={() => setSelectedUser(null)} />
          )}
          {creatingUser && (
            <CreateForm onCreate={handleCreate} onCancel={() => setCreatingUser(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default Users;
