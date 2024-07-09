"use server"

import { redirect } from "next/navigation"

export async function redirectToProfile() {
  return redirect('/profile')
}