import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Voucher } from './types';

interface VoucherCardProps {
  voucher: Voucher;
  handleDelete: (id: string) => void;
  getVoucherIcon: (voucher: Voucher) => StaticImageData;
}

const VoucherCard: React.FC<VoucherCardProps> = ({ voucher, handleDelete, getVoucherIcon }) => {
  const router = useRouter();

  const handleView = () => {
    router.push(`/dashboard/vouchers/${voucher.id}`);
  };

  return (
    <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
      <CardHeader className="p-0 bg-indigo-100">
        <Image src={getVoucherIcon(voucher)} alt="Voucher Icon" layout="responsive" width={600} height={150} className="w-full h-36 object-cover" />
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <CardTitle className="text-xl font-bold mb-2 text-indigo-600">{voucher.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-4">{voucher.code}</CardDescription>
        <div className="space-y-1 text-sm">
          <p className="text-gray-800"><strong>Description:</strong> {voucher.description}</p>
          <p className="text-gray-800"><strong>Claimable:</strong> {voucher.isClaimable ? 'Yes' : 'No'}</p>
          <p className="text-gray-800"><strong>Private:</strong> {voucher.isPrivate ? 'Yes' : 'No'}</p>
          <p className="text-gray-800"><strong>Type:</strong> {voucher.voucherType}</p>
          <p className="text-gray-800"><strong>Discount Type:</strong> {voucher.discountType}</p>
          <p className="text-gray-800"><strong>Fixed Discount:</strong> {voucher.fixedDiscount}</p>
          <p className="text-gray-800"><strong>Discount:</strong> {voucher.discount}%</p>
          <p className="text-gray-800"><strong>Stock:</strong> {voucher.stock}</p>
          <p className="text-gray-800"><strong>Min Order Price:</strong> {voucher.minOrderPrice}</p>
          <p className="text-gray-800"><strong>Min Order Item:</strong> {voucher.minOrderItem}</p>
          <p className="text-gray-800"><strong>Expires At:</strong> {new Date(voucher.expiresAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-indigo-100 flex justify-end space-x-2">
        <Button variant="secondary" onClick={handleView}>View</Button>
        <Button variant="secondary" onClick={() => handleDelete(voucher.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default VoucherCard;
