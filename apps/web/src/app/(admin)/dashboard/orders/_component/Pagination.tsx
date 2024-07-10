import React from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationDemo: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const paginationItems = Array.from({ length: totalPages }, (_, index) => (
    <PaginationItem key={index}>
      <PaginationLink href="#" isActive={currentPage === index + 1} onClick={() => onPageChange(index + 1)}>
        {index + 1}
      </PaginationLink>
    </PaginationItem>
  ));

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevious} aria-disabled={currentPage === 1} />
        </PaginationItem>
        {paginationItems}
        <PaginationItem>
          <PaginationNext onClick={handleNext} aria-disabled={currentPage === totalPages} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
