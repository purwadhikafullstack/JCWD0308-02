import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddressItem from './address-item';
import { Button } from '@/components/ui/button';
import CreateAddressForm from './address-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import {
  getAddressList,
} from '@/lib/fetch-api/address/client';
import { useMemo, useState } from 'react';

export default function UserAddressDialog({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const userAddressList = useSuspenseQuery({
    queryKey: ['address-list'],
    queryFn: getAddressList,
  });

  const [addressId, setAddressId] = useState('');
  const [activeTab, setActiveTab] = useState('address-list');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const editAddress = useMemo(() => {
    return userAddressList.data?.addressList?.find(
      (address) => address.id === addressId,
    );
  }, [addressId, userAddressList.data?.addressList]);

  if (userProfile.data?.user?.role !== 'USER') return null;

  return (
    <DialogContent className="py-6 sm:max-w-lg sm:max-h-[640px]">
      <DialogHeader>
        <DialogTitle>Choose Shipping Address</DialogTitle>
        <DialogDescription>
          Choose the most suitable address for you.
        </DialogDescription>
      </DialogHeader>
      <Tabs
        defaultValue={'address-list'}
        value={activeTab}
        onValueChange={handleTabChange}
        className=""
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="address-list">Addresses</TabsTrigger>
          <TabsTrigger value="new-address">New Address</TabsTrigger>
          <TabsTrigger
            disabled={addressId.length ? false : true}
            value={`edit-address-${addressId}`}
          >
            Edit Address
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="address-list"
          className="flex flex-col items-center max-h-[448px]"
        >
          {userAddressList.data?.addressList?.length ? (
            <>
              <ScrollArea className="relative w-full h-max flex flex-col">
                <div className="w-full flex flex-col gap-3">
                  {userAddressList.data.addressList.map((address) => (
                    <AddressItem
                      setActiveTab={setActiveTab}
                      setAddressId={setAddressId}
                      key={address.id}
                      address={address}
                    />
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex h-[448px] w-full items-center justify-center rounded-md border border-dashed text-sm">
              Please Create Your Shipping Address.
            </div>
          )}
          <div className="w-full pt-4">
            <Button
              onClick={() => {
                setActiveTab('new-address');
              }}
              className="w-full"
            >
              Add New Address
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="new-address">
          <CreateAddressForm
            setActiveTab={setActiveTab}
            setAddressId={setAddressId}
            type="create"
            handleClose={handleClose}
          />
        </TabsContent>

        <TabsContent value={`edit-address-${addressId}`}>
          <CreateAddressForm
            setActiveTab={setActiveTab}
            setAddressId={setAddressId}
            type="update"
            address={editAddress}
            handleClose={handleClose}
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
