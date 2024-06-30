import { env } from "@/app/env";
import fetchAPI from "@/lib/fetchAPI";
import { City } from "@/lib/types/city";

export const getCities = async (provinceId: number): Promise<{ cities: City[] } | null> => (await fetchAPI(`${env.NEXT_PUBLIC_BASE_API_URL}/city?provinceId=${provinceId}`)).json()
