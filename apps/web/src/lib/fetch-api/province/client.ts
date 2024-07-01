import { env } from "@/app/env";
import fetchAPI from "@/lib/fetchAPI";
import { Province } from "@/lib/types/province";

export const getProvinces = async (): Promise<{ provinces: Province[] } | null> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/province`)).json()
