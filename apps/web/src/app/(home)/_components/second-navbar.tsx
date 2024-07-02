'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  fetchAddresses,
  selectAddresses,
  selectSelectedAddressId,
  setSelectedAddressId,
} from '@/lib/features/address/addressSlice';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronDown, MapPin, MapPinIcon, TruckIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import UserAddress from './user-address';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

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

  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const [addressId, setAddressId] = useState('');
  const [activeTab, setActiveTab] = useState('address-list');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  // // if (userProfile.data?.user.role !== 'USER') return null;
  const addressList = [];

  return (
    <div className="hidden border-t sm:block py-2">
      <div className="container flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <TruckIcon className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Delivering from <span className="font-medium">Main St. Store</span>
          </p>
        </div>
        <UserAddress />
      </div>
    </div>
  );
}
// 'use client';
// import {
//   fetchAddresses,
//   selectAddresses,
//   selectSelectedAddressId,
//   setSelectedAddressId,
// } from '@/lib/features/address/addressSlice';
// import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
// import { getUserProfile } from '@/lib/fetch-api/user/client';
// import { useSuspenseQuery } from '@tanstack/react-query';
// import { ChevronDown, MapPin } from 'lucide-react';
// import React, { useEffect } from 'react';

// export default function SecondNavbar() {
//   const addressesReponse: any = useAppSelector(selectAddresses) || [];
//   const addresses = addressesReponse?.data || [];
//   const selectAddressId = useAppSelector(selectSelectedAddressId) || ``;

//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     dispatch(fetchAddresses());
//   }, [dispatch]);

//   const handleAddressChange = (addressId: any) => {
//     dispatch(setSelectedAddressId(addressId));
//   };

//   const userProfile = useSuspenseQuery({
//     queryKey: ['user-profile'],
//     queryFn: getUserProfile,
//   });

//   if (userProfile.data?.user.role !== 'USER') return null;

//   return (
//     <div>
//       <hr />
//       <div className="hidden sm:flex container mx-auto address justify-between p-2 bg-background">
//         <p className="flex items-center gap-2">
//           <ChevronDown className="h-5 w-5" />
//           From <strong>Grosirun Pusat</strong>
//         </p>
//         <div className="flex items-center gap-2">
//           <MapPin className="h-5 w-5" />
//           Deliver to
//           <select
//             value={selectAddressId || ''}
//             onChange={(e) => handleAddressChange(e.target.value)}
//             className="bg-background"
//           >
//             <option value="" disabled>
//               Select Address
//             </option>
//             {addresses &&
//               addresses.map((address: any) => (
//                 <option key={address.id} value={address.id}>
//                   {address.address}
//                 </option>
//               ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }
