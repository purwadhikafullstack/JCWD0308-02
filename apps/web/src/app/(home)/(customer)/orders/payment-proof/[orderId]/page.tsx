'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { uploadPaymentProof } from '@/lib/fetch-api/order';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function UploadPaymentProofPage() {
  const { orderId } = useParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = () => {
    if (fileRef.current && fileRef.current.files) {
      const selectedFile = fileRef.current.files[0];
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      if (file) {
        const res = await uploadPaymentProof(orderId as string, file);
        setSuccess('File uploaded successfully!');
        console.log('Response:', res);
      } else {
        setError('Please select a file to upload.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <Card className="w-full md:w-96">
        <CardContent>
          <label className="input input-bordered flex items-center gap-2">
            Payment Proof
            <input
              accept="image/png, image/jpeg"
              onChange={handleChange}
              type="file"
              ref={fileRef}
            />
          </label>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Submit'}
          </Button>
        </CardFooter>
      </Card>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && (
        <div>
          <p className="text-green-500 mt-2">Upload successful!</p>
          <Link href="/">Go to Home</Link>
        </div>
      )}
    </div>
  );
}
