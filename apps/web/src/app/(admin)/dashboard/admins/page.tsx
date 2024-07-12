'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  fetchUsers,
  updateUser,
  createUser,
} from '@/lib/fetch-api/user/client';
import EditForm from './_components/forms/EditFormUser';
import CreateForm from './_components/forms/CreateFormUser';
import UserTable from './_components/tables/usertable';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/partial/pagination';
import { handleApiError, showSuccess } from '@/components/toast/toastutils';
import { User } from '@/lib/types/user';
import SearchBarDebounce from '@/components/partial/SearchBarDeBounce';

const Users = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchUsers({ page, limit, search: searchQuery });
        setUsers(
          data.users.sort(
            (a: User, b: User) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        setTotalUsers(data.total);
        setSuggestions(data.users.map((user: User) => user.displayName).filter(Boolean)); // Filter non-string values
      } catch (error) {
        handleApiError(error, 'Failed to fetch users');
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
      setUpdateFlag((prev) => !prev);
      showSuccess('User updated successfully');
    } catch (error) {
      handleApiError(error, 'Failed to update user');
    }
  };

  const handleCreate = async (
    newUser: Omit<User, 'id' | 'referralCode' | 'createdAt' | 'updatedAt'> & {
      password: string;
    },
  ) => {
    try {
      await createUser(newUser);
      setCreatingUser(false);
      setUpdateFlag((prev) => !prev);
      showSuccess('User created successfully');
    } catch (error) {
      handleApiError(error, 'Failed to create user');
    }
  };

  const handleDelete = (user: User | null) => {
    setDeletingUser(user);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    updateUrl({ search: query, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ search: searchQuery, page: newPage });
  };

  const updateUrl = ({ search, page }: { search: string; page: number }) => {
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

  const removeUserFromState = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">Users</h2>
      <p>Manage your users here.</p>
      <div className="mt-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={() => setCreatingUser(true)} className="mb-4 sm:mb-0">
          Create User Admin
        </Button>
        <div className="w-full sm:w-1/2 lg:w-1/3 ">
          <SearchBarDebounce onSearch={handleSearch} suggestions={suggestions} />
        </div>
      </div>
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <span className="loader"></span>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <UserTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deletingUser={deletingUser}
              removeUserFromState={removeUserFromState}
            />
          </div>
          <Pagination
            total={totalUsers}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
          />
          {selectedUser && (
            <EditForm
              user={selectedUser}
              onUpdate={handleUpdate}
              onCancel={() => setSelectedUser(null)}
            />
          )}
          {creatingUser && (
            <CreateForm
              onCreate={handleCreate}
              onCancel={() => setCreatingUser(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Users;
