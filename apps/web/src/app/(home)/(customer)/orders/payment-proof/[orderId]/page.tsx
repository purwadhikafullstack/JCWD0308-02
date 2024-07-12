'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { uploadPaymentProof } from '@/lib/fetch-api/order';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';

export default function UploadPaymentProofPage() {
  const { orderId } = useParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const handleChange = () => {
    if (fileRef.current && fileRef.current.files) {
      const selectedFile = fileRef.current.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      if (file) {
        const fileSizeInBytes = file.size;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

        if (fileSizeInMB > 1) {
          setError(
            'File size exceeds 1 MB limit. Please upload a smaller file.',
          );
          return;
        }

        const res = await uploadPaymentProof(orderId as string, file);
        setSuccess('File uploaded successfully!');
        toast.success('File uploaded successfully!');
      } else {
        setError('Please select a file to upload.');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('File too large, try again');
      setError('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <Card className="w-full md:w-96">
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <label className="text-lg font-semibold">
              Upload Payment Proof
            </label>
            <div className="relative bg-gray-200 rounded-lg p-8 flex flex-col justify-center items-center">
              {filePreview ? (
                <Image
                  src={filePreview}
                  width={50}
                  height={100}
                  alt="Preview"
                  className="w-full h-auto mb-4"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400 mb-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M5 4a5 5 0 0110 0v1h1a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h1V4zm10 5H5v9h10V9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <div className="relative">
                <input
                  accept="image/png, image/jpeg"
                  onChange={handleChange}
                  type="file"
                  ref={fileRef}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="h-12 bg-white flex items-center justify-between rounded-lg px-4 border border-gray-300">
                  {fileName ? (
                    <span className="truncate">{fileName}</span>
                  ) : (
                    <span className="text-gray-500">
                      Drag and drop your file here or click to upload
                    </span>
                  )}
                  {file && (
                    <button
                      className="text-red-500 hover:text-red-700 ml-3"
                      onClick={() => {
                        setFile(null);
                        setFileName(null);
                        setFilePreview(null);
                        if (fileRef.current) {
                          fileRef.current.value = '';
                        }
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            {uploading ? 'Uploading...' : 'Submit'}
          </Button>
        </CardFooter>
      </Card>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && (
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-green-500">{success}</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Go to Home
          </Link>
        </div>
      )}
    </div>
  );
}
