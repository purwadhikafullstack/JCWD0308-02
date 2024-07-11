'use client';
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
import InputField from '../fields/InputField';
import SelectField from '../fields/SelectField';

interface EditFormProps {
  user: User;
  onUpdate: (id: string, user: Partial<User> & { store?: string }) => void;
  onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<Partial<User> & { store?: string }>({
    displayName: user.displayName,
    email: user.email,
    accountType: user.accountType,
    contactEmail: user.contactEmail,
    role: user.role,
    status: user.status,
    updatedAt: user.updatedAt,
    store: user.StoreAdmin?.storeId || '',
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
    if (formData.role === 'SUPER_ADMIN') {
      formData.store = 'Grosir Pusat';
    }
    onUpdate(user.id, formData);
  };

  return (
    <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>Edit the details of the user below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Name"
                name="displayName"
                value={formData.displayName || ''}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
              <InputField
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail || ''}
                onChange={handleChange}
              />
              <SelectField
                label="Status"
                name="status"
                value={formData.status || 'ACTIVE'}
                onChange={handleChange}
                options={['ACTIVE', 'INACTIVE', 'SUSPENDED']}
              />
              <InputField
                label="Role"
                name="role"
                type="text"
                value={formData.role || ''}
                readOnly={true}
                className="bg-gray-100 cursor-not-allowed"
                onChange={() => {}}
              />
              <InputField
                label="Updated At"
                name="updatedAt"
                type="text"
                value={new Date(
                  formData.updatedAt || new Date(),
                ).toLocaleDateString()}
                readOnly={true}
                className="bg-gray-100 cursor-not-allowed"
                onChange={() => {}}
              />
              {formData.role !== 'USER' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Work at
                    </label>
                    <StoreSelector
                      storeId={user?.StoreAdmin?.storeId}
                      disable={
                        formData.role !== 'STORE_ADMIN' ||
                        user?.StoreAdmin?.storeId
                          ? true
                          : false
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Move to
                    </label>
                    <StoreSelector
                      disable={formData.role !== 'STORE_ADMIN'}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
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
                Update
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditForm;
