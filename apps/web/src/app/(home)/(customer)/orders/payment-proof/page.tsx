'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import React, { useState } from 'react';

export default function UploadPaymentProof() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="h-screen flex justify-center items-center">
      <Card>
        <CardContent>
          <label className="input input-bordered flex items-center gap-2">
            Photo Profile
            <input
              type="file"
              onChange={(e: any) => setFile(e.target.files[0])}
            />
          </label>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit">Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
