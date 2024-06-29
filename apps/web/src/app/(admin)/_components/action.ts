"use server"

import { cookies } from "next/headers"

export const changeStore = async (storeId: string) => {
  cookies().set("storeId", storeId)
  // return storeId
}