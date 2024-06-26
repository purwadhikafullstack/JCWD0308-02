"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/types/user';

interface EditFormProps {
  user: User;
  onUpdate: (id: string, user: Partial<User>) => void;
  onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    displayName: user.displayName,
    email: user.email,
    accountType: user.accountType,
    contactEmail: user.contactEmail,
    role: user.role,
    status: user.status,
    updatedAt: user.updatedAt,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(user.id, formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>Edit the details of the user below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select
                  name="accountType"
                  value={formData.accountType || 'EMAIL'}
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
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role || 'USER'}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="STORE_ADMIN">Store Admin</option>
                  <option value="USER">User</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status || 'ACTIVE'}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Updated At</label>
                <input
                  type="text"
                  name="updatedAt"
                  value={new Date(formData.updatedAt || new Date()).toLocaleDateString()}
                  readOnly
                  className="mt-1 block w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <CardFooter className="mt-4 flex justify-end space-x-4">
              <Button type="button" onClick={onCancel} className="px-4 py-2 border rounded bg-gray-300">Cancel</Button>
              <Button type="submit" className="px-4 py-2 border rounded bg-blue-500 text-white">Update</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditForm;
