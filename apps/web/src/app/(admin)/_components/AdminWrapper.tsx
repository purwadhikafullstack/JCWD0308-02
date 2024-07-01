"use client"
import { getUserProfile } from "@/lib/fetch-api/user/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

export default function AdminWrapper({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const {data} = useSuspenseQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile
  })

  if (!data?.user) {
    router.push('/auth/signin')
  }

  return (
    <>{children}</>
  )
}