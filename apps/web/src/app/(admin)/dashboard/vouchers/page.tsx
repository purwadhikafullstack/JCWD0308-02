"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getVouchers, createVoucher, deleteVoucher } from '@/lib/fetch-api/voucher';
import { Toaster } from '@/components/ui/sonner';

import { Voucher } from './_components/types';
import VoucherCard from './_components/vouchercard';
import VoucherFilters from './_components/voucherfilters';
import CreateForm from './_components/createform';
import Pagination from '@/components/partial/pagination';
import SearchBar from '@/components/partial/SearchBar';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { handleApiError } from '@/components/toast/errorapi';
import { showSuccess } from '@/components/toast/toastutils';

import fixedDiscountProduct from '../../../../../public/fixeddiscountproduct.png';
import discountProduct from '../../../../../public/discountproduct.png';
import shippingCash from '../../../../../public/shippingcash.png';
import shippingDiscount from '../../../../../public/shippingdiscount.png';
import { StaticImageData } from 'next/image';

const VoucherManagement = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creatingVoucher, setCreatingVoucher] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(8); // Adjust limit to fit 4 cards per row
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const voucherData = await getVouchers(page, limit, filters);
        setVouchers(voucherData.vouchers || []);
        setTotal(voucherData.total || 0);
      } catch (error) {
        handleApiError(error, 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, limit, filters, updateFlag]);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
      setFilters((prevFilters: any) => ({ ...prevFilters, search: query }));
    }
  }, [searchParams]);

  const handleCreate = async (newVoucher: any) => {
    try {
      await createVoucher(newVoucher);
      showSuccess('Voucher created successfully');
      setUpdateFlag(!updateFlag);
      setCreatingVoucher(false);
    } catch (error) {
      handleApiError(error, 'Failed to create voucher');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVoucher(id);
      showSuccess('Voucher deleted successfully');
      setUpdateFlag(!updateFlag);
    } catch (error) {
      handleApiError(error, 'Failed to delete voucher');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
    const params = new URLSearchParams(searchParams);
    params.set('search', query);
    params.set('page', '1');
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  const getVoucherIcon = (voucher: Voucher): StaticImageData => {
    if (voucher.voucherType === 'PRODUCT' && voucher.discountType === 'FIXED_DISCOUNT') {
      return fixedDiscountProduct;
    } else if (voucher.voucherType === 'PRODUCT' && voucher.discountType === 'DISCOUNT') {
      return discountProduct;
    } else if (voucher.voucherType === 'SHIPPING_COST' && voucher.discountType === 'FIXED_DISCOUNT') {
      return shippingCash;
    } else if (voucher.voucherType === 'SHIPPING_COST' && voucher.discountType === 'DISCOUNT') {
      return shippingDiscount;
    }
    return fixedDiscountProduct; // Default icon, adjust as necessary
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-600">Vouchers</h2>
      <p className="text-lg mb-8 text-center text-gray-700">Manage your vouchers here.</p>
      <SearchBar onSearch={handleSearch} />
      <VoucherFilters handleCreate={() => setCreatingVoucher(true)} />
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {vouchers.map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} handleDelete={handleDelete} getVoucherIcon={getVoucherIcon} />
            ))}
          </div>
          {creatingVoucher && (
            <Dialog open={creatingVoucher} onOpenChange={setCreatingVoucher}>
              <DialogTrigger asChild>
                <Button className="hidden">Open Modal</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Voucher</DialogTitle>
                  <DialogDescription>
                    <CreateForm onCreate={handleCreate} onCancel={() => setCreatingVoucher(false)} />
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setCreatingVoucher(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Pagination total={total} page={page} limit={limit} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default VoucherManagement;
