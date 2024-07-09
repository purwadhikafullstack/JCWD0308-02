'use server';
import { IUserProfile } from "@/lib/types/user";
import { redirect } from "next/navigation";

export const redirectSignin = async (user: IUserProfile, redirectTo: string) => {
  if (user.role === "USER") {
    return redirect(redirectTo || '/');
  } else {
    return redirect('/dashboard');
  }
};