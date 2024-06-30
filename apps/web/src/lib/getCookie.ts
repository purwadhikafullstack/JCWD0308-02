import { isServer } from "@tanstack/react-query"
import { headers } from "next/headers"

export const getCookie = () => {
  if (typeof window === 'undefined' && isServer) {
    // Server: always make a new query client
    return new Headers(headers())
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    return null
  }
}