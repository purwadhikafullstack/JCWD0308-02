import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { StockMutation } from '@/lib/types/reports';

interface ReportsTableRowProps {
  report: StockMutation;
  index: number;
}

const ReportsTableRow: React.FC<ReportsTableRowProps> = ({ report, index }) => {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{report.id}</TableCell>
      <TableCell>{report.stockId}</TableCell>
      <TableCell>{report.mutationType}</TableCell>
      <TableCell>{report.amount}</TableCell>
      <TableCell>{report.description}</TableCell>
      <TableCell>{report.adminId}</TableCell>
      <TableCell>{report.orderId}</TableCell>
      <TableCell>{new Date(report.updatedAt).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
    </TableRow>
  );
};

export default ReportsTableRow;
