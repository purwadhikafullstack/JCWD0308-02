import React from 'react';
import { Button } from '@/components/ui/button';

interface VoucherFiltersProps {
  handleCreate: () => void;
}

const VoucherFilters: React.FC<VoucherFiltersProps> = ({ handleCreate }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button onClick={handleCreate} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all">
        Create Voucher
      </Button>
    </div>
  );
};

export default VoucherFilters;
