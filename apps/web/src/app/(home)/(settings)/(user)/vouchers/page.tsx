'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import {
  getUserVouchers,
} from '@/lib/fetch-api/voucher';
import Image, { StaticImageData } from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import fixedDiscountProduct from '../../../../../../public/fixeddiscountproduct.png';
import discountProduct from '../../../../../../public/discountproduct.png';
import shippingCash from '../../../../../../public/shippingcash.png';
import shippingDiscount from '../../../../../../public/shippingdiscount.png';

const FullPageVouchers: React.FC = () => {

  const userVouchers = useSuspenseQuery({
    queryKey: ['user-vouchers'],
    queryFn: getUserVouchers,
  });

  const getVoucherIcon = (voucher: any): StaticImageData => {
    if (
      voucher.voucher.voucherType === 'PRODUCT' &&
      voucher.voucher.discountType === 'FIXED_DISCOUNT'
    ) {
      return fixedDiscountProduct;
    } else if (
      voucher.voucher.voucherType === 'PRODUCT' &&
      voucher.voucher.discountType === 'DISCOUNT'
    ) {
      return discountProduct;
    } else if (
      voucher.voucher.voucherType === 'SHIPPING_COST' &&
      voucher.voucher.discountType === 'FIXED_DISCOUNT'
    ) {
      return shippingCash;
    } else if (
      voucher.voucher.voucherType === 'SHIPPING_COST' &&
      voucher.voucher.discountType === 'DISCOUNT'
    ) {
      return shippingDiscount;
    }
    return fixedDiscountProduct;
  };

  return (
    <div className="flex flex-col items-center  min-h-screen  bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Available Vouchers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4">
        {userVouchers?.data.map((voucher: any) => (
          <Card key={voucher.id} className="w-full">
            <CardHeader className="flex items-center p-2 bg-secondary text-secondary-foreground rounded-t-lg">
              <Image
                src={getVoucherIcon(voucher)}
                alt={voucher.voucher.name}
                width={300}
                height={80}
                className="rounded-lg"
              />
              <div className="">
                <CardTitle className="text-xl font-bold text-center text-primary">
                  {voucher.voucher.name}
                </CardTitle>
                <CardDescription className="text-sm mt-4 text-center">
                  {voucher.voucher.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm" suppressHydrationWarning>
                Expires At: {new Date(voucher.expiresAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FullPageVouchers;
