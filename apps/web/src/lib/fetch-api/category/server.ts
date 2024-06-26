import "server-only";
import { env } from "@/app/env";
import fetchSSR from "@/lib/fetchSSR";
import { Category } from "@/lib/types/category";

export const getCategory = async (): Promise<Category[]> =>
  (await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/category`, { cache: 'force-cache' })).json()
