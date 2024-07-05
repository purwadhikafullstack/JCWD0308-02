import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdditionalInfoProps {
  note: string;
  setNote: (note: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  note,
  setNote,
  paymentMethod,
  setPaymentMethod,
}) => {
  return (
    <div className="flex flex-col gap-6 mt-5 md:flex-row">
      <Card className="bg-white text-gray-800 shadow-lg rounded-lg flex-1">
        <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="text-xl font-bold">Note</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Add a note for your order"
          />
        </CardContent>
      </Card>
      <Card className="bg-white text-gray-800 shadow-lg rounded-lg flex-1">
        <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="text-xl font-bold">Choose Payment</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Payment</option>
            <option value="MANUAL">Manual</option>
            <option value="GATEWAY">Payment Gateway</option>
          </select>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalInfo;
