"use server"

import { cookies } from "next/headers"

export const changeAddress = async (addressId: string) => {
  cookies().set("addressId", addressId)
  // return storeId
}