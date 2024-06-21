'use client';
import React from 'react';

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

const PaginationButton = ({ disabled, onClick, children }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`gap-1 px-4 py-2 rounded-md ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600 transition-all'}`}
  >
    {children}
  </button>
);

const Pagination: React.FC<PaginationProps> = ({ total, page, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mt-6 flex justify-center items-center">
      <PaginationButton onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        <span>Previous</span>
      </PaginationButton>
      {[...Array(totalPages).keys()].map((pageIndex) => (
        <button
          key={pageIndex}
          className={`px-4 py-2 ${pageIndex + 1 === page ? 'text-white bg-indigo-500' : 'text-gray-700'}`}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          {pageIndex + 1}
        </button>
      ))}
      <PaginationButton onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        <span>Next</span>
      </PaginationButton>
    </div>
  );
};

export default Pagination;
