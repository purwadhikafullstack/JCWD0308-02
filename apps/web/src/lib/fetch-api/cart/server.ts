import { API_URL } from "../lib";
import { cookies } from "next/headers";

const fetchSSR = (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  const modifiedInit: RequestInit = {
    ...init,
    credentials: init.credentials ?? "include",
    headers: {
      Cookie: cookies().toString(),
    },
  };

  return fetch(input, modifiedInit);
};

export const getCarts = async (page: number, perPage: number) => {
  const response = await fetchSSR(`${API_URL}/cart`);
  return await response.json();
};
