'use client';

import React, { useState } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getSelectedStore } from '@/lib/fetch-api/store/client';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { getStockMutation, getStockMutationById } from '@/lib/fetch-api/report';
import ReportsTable from './_component/ReportsTable';
import { PaginationDemo } from './_component/PaginationDemo';

export default function ReportsPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 10;

  const { data: selectedStoreData } = useQuery({
    queryKey: ['store'],
    queryFn: getSelectedStore,
  });
  const storeId = selectedStoreData?.store?.id;
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });
  const superAdminOnly = userProfile.data?.user?.role === 'SUPER_ADMIN';
  const {
    data: reportsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reports', currentPage, storeId],
    queryFn: () => {
      if (superAdminOnly) {
        console.log('Fetching reports for Super Admin');
        return getStockMutation(currentPage, perPage);
      } else {
        console.log('Fetching reports for Store Admin');
        return getStockMutationById(currentPage, perPage);
      }
    },
    enabled: !!storeId,
  });

  const reports = reportsData?.data || [];
  console.log('reports:', reports);
  const totalPages = Math.ceil((reportsData?.totalCount || 0) / perPage);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Reports</h2>
      <div className="mt-4">
        {isLoading ? (
          <div className="h-screen flex justify-center items-center">
            <span className="loader"></span>
          </div>
        ) : isError ? (
          <p className="text-red-500">Error: Failed to fetch reports.</p>
        ) : (
          <div className="overflow-x-auto">
            <ReportsTable reports={reports} />
          </div>
        )}
      </div>
      <div className="mt-4">
        <PaginationDemo
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
