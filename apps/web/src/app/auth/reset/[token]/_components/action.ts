'use server';
import { IUserProfile } from "@/lib/types/user";
import { redirect } from "next/navigation";

export const redirectSignin = async (user: IUserProfile) => {
  if (user.role === "USER") {
    return redirect('/');
  } else {
    return redirect('/dashboard');
  }
};