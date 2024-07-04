import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { StockMutation } from '@/lib/types/reports';
import ReportsTableRow from './ReportsTableRow';

interface ReportsTableProps {
  reports: StockMutation[];
}

const ReportsTable: React.FC<ReportsTableProps> = ({ reports }) => {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Stock ID</TableHead>
            <TableHead>Mutation Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Admin ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => (
            <ReportsTableRow key={report.id} report={report} index={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsTable;
