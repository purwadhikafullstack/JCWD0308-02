'use client';

import React, { useState, useEffect } from 'react';
import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { getVouchers, assignVoucherToUser, getUserVouchers } from '@/lib/fetch-api/voucher';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { getNearestStocks } from '@/lib/fetch-api/stocks/client';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import Image, { StaticImageData } from 'next/image';
import { handleApiError, showSuccess } from '@/components/toast/toastutils';

import fixedDiscountProduct from '../../../../../../public/fixeddiscountproduct.png';
import discountProduct from '../../../../../../public/discountproduct.png';
import shippingCash from '../../../../../../public/shippingcash.png';
import shippingDiscount from '../../../../../../public/shippingdiscount.png';

interface VoucherDrawerProps {
  onSelectVoucher: (voucherId: string, voucherName: string, voucherDiscount: number, voucherType: string, discountType: string) => void;
  selectedItems: any[];
  shippingCost: number | null;
}

const VoucherDrawer: React.FC<VoucherDrawerProps> = ({ onSelectVoucher, selectedItems, shippingCost }) => {
  const nearestStocks = useSuspenseQuery({
    queryKey: ['nearest-stocks', 1, 15, ''],
    queryFn: async ({ queryKey }) => {
      const filters = Object.fromEntries(new URLSearchParams(String('')));
      return getNearestStocks(Number(1), Number(15), filters);
    },
  });

  const { data: userProfile } = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const { data: vouchers } = useSuspenseQuery({
    queryKey: ['vouchers'],
    queryFn: async () => {
      const response = await getVouchers(1, 100);
      return response.vouchers;
    },
  });
  const { data: userVouchers, error: userVouchersError } = useSuspenseQuery({
    queryKey: ['user-vouchers'],
    queryFn: getUserVouchers,
  });
  useEffect(() => {
    if (userVouchersError) {
      handleApiError(userVouchersError, 'Failed to fetch user vouchers');
    }
  }, [userVouchersError]);

  const [claimedVouchers, setClaimedVouchers] = useState<string[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);

  useEffect(() => {
    if (userVouchers && Array.isArray(userVouchers)) {
      setClaimedVouchers(userVouchers.map((userVoucher: any) => userVoucher.voucher.id));
    }
  }, [userVouchers]);

  const filteredVouchers = vouchers?.filter((voucher: any) => !voucher.storeId || voucher.storeId === nearestStocks?.data?.store.id) || [];

  const getVoucherIcon = (voucher: any): StaticImageData => {
    if (voucher.voucherType === 'PRODUCT' && voucher.discountType === 'FIXED_DISCOUNT') {
      return fixedDiscountProduct;
    } else if (voucher.voucherType === 'PRODUCT' && voucher.discountType === 'DISCOUNT') {
      return discountProduct;
    } else if (voucher.voucherType === 'SHIPPING_COST' && voucher.discountType === 'FIXED_DISCOUNT') {
      return shippingCash;
    } else if (voucher.voucherType === 'SHIPPING_COST' && voucher.discountType === 'DISCOUNT') {
      return shippingDiscount;
    }
    return fixedDiscountProduct;
  };

  const handleClaimVoucher = useMutation({
    mutationFn: async (voucherId: string) => {
      if (!userProfile?.user?.id) throw new Error('User ID is undefined');
      await assignVoucherToUser(voucherId, userProfile.user.id);
      setClaimedVouchers([...claimedVouchers, voucherId]);
      showSuccess('Voucher claimed successfully!');
    },
    onError: (error: any) => {
      handleApiError(error, 'Failed to claim voucher');
    },
  });

  const handleUseVoucher = (voucher: any) => {
    setSelectedVoucher(voucher.id);
    let discountAmount = 0;

    if (voucher.voucherType === 'SHIPPING_COST') {
      if (voucher.discountType === 'FIXED_DISCOUNT') {
        discountAmount = voucher.fixedDiscount;
      } else if (voucher.discountType === 'DISCOUNT') {
        discountAmount = (voucher.discount / 100) * (shippingCost ?? 0);
      }
    } else if (voucher.voucherType === 'PRODUCT') {
      const subtotal = selectedItems.reduce((acc, item) => {
        const itemPrice = item.isPack ? item.stock.product.packPrice : item.stock.product.price;
        return acc + itemPrice * item.quantity;
      }, 0);

      if (voucher.discountType === 'FIXED_DISCOUNT') {
        discountAmount = voucher.fixedDiscount;
      } else if (voucher.discountType === 'DISCOUNT') {
        discountAmount = (voucher.discount / 100) * subtotal;
      }
    }

    onSelectVoucher(voucher.id, voucher.name, discountAmount, voucher.voucherType, voucher.discountType);
    document.getElementById('voucher-drawer-close')?.click();
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Use Voucher</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Claim Your Voucher</DrawerTitle>
          <DrawerDescription>Select a voucher to claim it</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4 h-96 overflow-y-auto">
          {filteredVouchers.map((voucher: any) => (
            <div key={voucher.id} className="flex items-center p-4 border rounded-lg">
              <Image src={getVoucherIcon(voucher)} alt={voucher.name} width={50} height={50} />
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-bold">{voucher.name}</h2>
                <p className="text-sm">{voucher.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant={claimedVouchers.includes(voucher.id) ? 'secondary' : 'default'} disabled={claimedVouchers.includes(voucher.id)} onClick={() => handleClaimVoucher.mutate(voucher.id)}>
                  {claimedVouchers.includes(voucher.id) ? 'Claimed' : 'Claim'}
                </Button>
                <Button variant="default" onClick={() => handleUseVoucher(voucher)}>
                  Use
                </Button>
              </div>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" id="voucher-drawer-close">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default VoucherDrawer;
