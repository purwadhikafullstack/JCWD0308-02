"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/types/user';
import { StoreSelector } from '@/app/(admin)/_components/store-selector';
import InputField from '../fields/InputField';
import SelectField from '../fields/SelectField';


interface CreateFormProps {
  onCreate: (
    user: Omit<User, 'id' | 'referralCode' | 'createdAt' | 'updatedAt'> & {
      password: string;
      store?: string;
    },
  ) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreate, onCancel }) => {
  const [formData, setFormData] = useState<Omit<User, 'id' | 'referralCode' | 'createdAt' | 'updatedAt'> & { store?: string }>({
    displayName: '',
    email: '',
    contactEmail: '',
    password: '',
    accountType: 'EMAIL',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.role === 'SUPER_ADMIN') {
      formData.store = 'Grosir Pusat';
    }
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Create User</CardTitle>
          <CardDescription>Fill in the details to create a new user.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Name" name="displayName" value={formData.displayName} onChange={handleChange} required />
              <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <InputField label="Contact Email" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} required />
              <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              <SelectField label="Account Type" name="accountType" value={formData.accountType} options={['EMAIL', 'GOOGLE', 'FACEBOOK', 'GITHUB']} onChange={handleChange} />
              <SelectField label="Role" name="role" value={formData.role} options={['SUPER_ADMIN', 'STORE_ADMIN']} onChange={handleChange} />
              <SelectField label="Status" name="status" value={formData.status} options={['ACTIVE', 'INACTIVE', 'SUSPENDED']} onChange={handleChange} />
              <div>
                <label className="block text-sm font-medium text-gray-700">Store</label>
                <StoreSelector disable={formData.role === "SUPER_ADMIN"} className='mt-1' />
              </div>
            </div>
            <CardFooter className="mt-4 flex justify-end space-x-4">
              <Button type="button" onClick={onCancel} className="px-4 py-2 border rounded bg-gray-300">Cancel</Button>
              <Button type="submit" className="px-4 py-2 border rounded bg-blue-500 text-white">Create</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateForm;
