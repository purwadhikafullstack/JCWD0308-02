'use client';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  getSelectedAddress,
} from '@/lib/fetch-api/address/client';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import {  MapPinIcon, } from 'lucide-react';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import UserAddressDialog from './user-address-dialog';

export default function UserAddress() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const selectedAddress = useSuspenseQuery({
    queryKey: ['selected-address'],
    queryFn: getSelectedAddress,
  });

  if (userProfile.data?.user?.role !== 'USER') return null;

  return (
    <div className="flex items-center gap-2">
      <MapPinIcon className="w-5 h-5 text-muted-foreground" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="text-sm text-muted-foreground hover:underline underline-offset-4">
            {selectedAddress.data?.address
              ? selectedAddress.data.address.labelAddress
              : 'Set your Shipping address'}
          </button>
        </DialogTrigger>
        {open ? <UserAddressDialog handleClose={handleClose} /> : null}
      </Dialog>
    </div>
  );
}
