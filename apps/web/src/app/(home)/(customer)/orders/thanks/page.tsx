import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Thanks',
}

export default function page() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4 bg-gray-100">
      <h3 className="text-3xl font-bold text-center text-primary mb-4">Thank you for your purchase!</h3>
      <Link href="/">
        <a className="text-lg text-center text-primary hover:underline">Back to Homepage</a>
      </Link>
    </div>
  );
}
