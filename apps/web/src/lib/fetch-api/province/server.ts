import { env } from "@/app/env";
import fetchSSR from "@/lib/fetchSSR";
import { Province } from "@/lib/types/province";

export const getProvinces = async (): Promise<{ provinces: Province[] } | null> => (await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/province`)).json()
