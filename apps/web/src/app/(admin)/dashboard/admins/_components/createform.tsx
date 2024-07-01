import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/types/user';
import { StoreSelector } from '@/app/(admin)/_components/store-selector';
import { Label } from '@/components/ui/label';

interface CreateFormProps {
  onCreate: (
    user: Omit<User, 'id' | 'referralCode' | 'createdAt' | 'updatedAt'> & {
      password: string;
    },
  ) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreate, onCancel }) => {
  const [formData, setFormData] = useState<
    Omit<User, 'id' | 'referralCode' | 'createdAt' | 'updatedAt'>
  >({
    displayName: '',
    email: '',
    contactEmail: '',
    password: '',
    accountType: 'EMAIL',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Create User</CardTitle>
          <CardDescription>
            Fill in the details to create a new user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                >
                  <option value="EMAIL">Email</option>
                  <option value="GOOGLE">Google</option>
                  <option value="FACEBOOK">Facebook</option>
                  <option value="GITHUB">Github</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="STORE_ADMIN">Store Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Store
                </label>
                <StoreSelector disable={formData.role === "SUPER_ADMIN"} className='mt-1' />
              </div>
            </div>
            <CardFooter className="mt-4 flex justify-end space-x-4">
              <Button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 border rounded bg-blue-500 text-white"
              >
                Create
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateForm;
