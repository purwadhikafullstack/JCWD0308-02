'use server';
import { redirect } from "next/navigation";

export const redirectSignin = async () => {
  return redirect('/auth/signin');
};