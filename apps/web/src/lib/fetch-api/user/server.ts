import "server-only"
import { env } from "@/app/env"
import fetchSSR from "@/lib/fetchSSR"
import { IUserProfile } from "@/lib/types/user"

export const getUserProfile = async (): Promise<{ user: IUserProfile } | null> => (await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/users/profile`)).json()
