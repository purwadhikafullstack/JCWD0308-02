'use client';
import {
  fetchAddresses,
  selectAddresses,
  selectSelectedAddressId,
  setSelectedAddressId,
} from '@/lib/features/address/addressSlice';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { ChevronDown, MapPin } from 'lucide-react';
import React, { useEffect } from 'react';

export default function SecondNavbar() {
  const addressesReponse: any = useAppSelector(selectAddresses) || [];
  const addresses = addressesReponse?.data || [];
  const selectAddressId = useAppSelector(selectSelectedAddressId) || ``;

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleAddressChange = (addressId: any) => {
    dispatch(setSelectedAddressId(addressId));
  };

  return (
    <div>
      <hr />
      <div className="hidden sm:flex container mx-auto address justify-between p-2 bg-background">
        <p className="flex items-center gap-2">
          <ChevronDown className="h-5 w-5" />
          From <strong>Grosirun Pusat</strong>
        </p>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Deliver to
          <select
            value={selectAddressId || ''}
            onChange={(e) => handleAddressChange(e.target.value)}
            className="bg-background"
          >
            <option value="" disabled>
              Select Address
            </option>
            {addresses &&
              addresses.map((address: any) => (
                <option key={address.id} value={address.id}>
                  {address.address}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
