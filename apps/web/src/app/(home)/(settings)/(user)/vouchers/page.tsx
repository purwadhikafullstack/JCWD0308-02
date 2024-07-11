"use client";

import React, { useState, useEffect } from 'react';
import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { getVouchers, assignVoucherToUser, getUserVouchers } from '@/lib/fetch-api/voucher';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { getNearestStocks } from '@/lib/fetch-api/stocks/client';
import Image, { StaticImageData } from 'next/image';
import { handleApiError, showSuccess } from '@/components/toast/toastutils';
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent
} from '@/components/ui/card';
import fixedDiscountProduct from '../../../../../../public/fixeddiscountproduct.png';
import discountProduct from '../../../../../../public/discountproduct.png';
import shippingCash from '../../../../../../public/shippingcash.png';
import shippingDiscount from '../../../../../../public/shippingdiscount.png';
import { Button } from '@/components/ui/button';

const FullPageVouchers: React.FC = () => {
    const nearestStocks = useSuspenseQuery({
        queryKey: ['nearest-stocks', 1, 15, ''],
        queryFn: async ({ queryKey }) => {
            const filters = Object.fromEntries(new URLSearchParams(String("")));
            return getNearestStocks(Number(1), Number(15), filters);
        }
    });

    const { data: userProfile } = useSuspenseQuery({
        queryKey: ['user-profile'],
        queryFn: getUserProfile,
    });

    const { data: vouchers } = useSuspenseQuery({
        queryKey: ['vouchers'],
        queryFn: async () => {
            const response = await getVouchers(1, 100); // Adjust pagination as needed
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

    useEffect(() => {
        if (userVouchers && Array.isArray(userVouchers)) {
            setClaimedVouchers(userVouchers.map((userVoucher: any) => userVoucher.voucher.id));
        }
    }, [userVouchers]);

    const filteredVouchers = vouchers?.filter(
        (voucher: any) => !voucher.storeId || voucher.storeId === nearestStocks?.data?.store.id
    ) || [];

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

    return (
        <div className="flex flex-col items-center  min-h-screen  bg-gray-50">
            <h1 className="text-3xl font-bold mb-8">Available Vouchers</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4">
                {filteredVouchers.map((voucher: any) => (
                    <Card key={voucher.id} className="w-full">
                        <CardHeader className="flex items-center p-2 bg-secondary text-secondary-foreground rounded-t-lg">
                            <Image src={getVoucherIcon(voucher)} alt={voucher.name} width={300} height={80} className="rounded-lg" />
                            <div className="">
                                <CardTitle className="text-xl font-bold text-center text-primary">{voucher.name}</CardTitle>
                                <CardDescription className="text-sm mt-4 text-center">{voucher.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <p className="text-sm">Discount: {voucher.discountType === 'DISCOUNT' ? `${voucher.discount}%` : `Rp ${voucher.fixedDiscount.toLocaleString()}`}</p>
                            <p className="text-sm">Minimum Order: Rp {voucher.minOrderPrice.toLocaleString()}</p>
                            <p className="text-sm">Stock: {voucher.stock}</p>
                            <p className="text-sm">Expires At: {new Date(voucher.expiresAt).toLocaleDateString()}</p>
                        </CardContent>
                        <CardFooter className="p-4 flex justify-end">
                            <Button
                                variant={claimedVouchers.includes(voucher.id) ? "secondary" : "default"}
                                disabled={claimedVouchers.includes(voucher.id)}
                                onClick={() => handleClaimVoucher.mutate(voucher.id)}
                            >
                                {claimedVouchers.includes(voucher.id) ? 'Claimed' : 'Claim'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FullPageVouchers;
