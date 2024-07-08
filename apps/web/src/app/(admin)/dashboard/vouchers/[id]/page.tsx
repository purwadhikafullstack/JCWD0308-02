"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { getVoucherById, updateVoucher } from '@/lib/fetch-api/voucher';
import { Toaster, toast } from '@/components/ui/sonner';
import { Voucher } from '@/lib/types/voucher';
import { Button } from '@/components/ui/button';
import EditForm from '../_components/forms/EditVoucherForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const VoucherDetail: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split('/').pop(); 
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const API_BASE_URL = 'http://localhost:8000'; // Define your API base URL here

  useEffect(() => {
    if (id) {
      const fetchVoucher = async () => {
        try {
          const voucherData = await getVoucherById(id as string);
          setVoucher(voucherData);
        } catch (error) {
          console.error('Failed to fetch voucher', error);
          setError('Failed to fetch voucher');
        } finally {
          setLoading(false);
        }
      };
      fetchVoucher();
    }
  }, [id]);

  const handleUpdate = async (data: FormData) => {
    if (id && voucher) {
      try {
        await updateVoucher(id as string, data);
        toast.success('Voucher updated successfully');
        setEditing(false);
        const updatedVoucher = await getVoucherById(id as string);
        setVoucher(updatedVoucher);
      } catch (error) {
        console.error('Failed to update voucher', error);
        toast.error('Failed to update voucher');
      }
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-gray-500">{error}</p>;
  }

  if (!voucher) {
    return <p className="text-center text-gray-500">Voucher not found</p>;
  }

  const imageUrl = voucher.imageUrl
    ? voucher.imageUrl.startsWith('/public')
      ? `${API_BASE_URL}${voucher.imageUrl}`
      : voucher.imageUrl
    : '/path/to/default-image.jpg'; // Provide a default image path

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-600">{voucher.name}</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative w-full h-64 bg-indigo-100">
          {voucher.imageUrl && (
            <Image
              src={imageUrl}
              alt={voucher.name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          )}
        </div>
        <div className="p-4">
          <p className="text-lg mb-4 text-gray-700">{voucher.description}</p>
          <div className="space-y-1 text-sm">
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
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Voucher</DialogTitle>
            <DialogDescription>
              Update the details of the voucher below.
            </DialogDescription>
          </DialogHeader>
          <EditForm voucher={voucher} onUpdate={handleUpdate} onCancel={() => setEditing(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoucherDetail;
