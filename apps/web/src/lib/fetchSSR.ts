import { headers } from "next/headers";

const fetchSSR = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  return fetch(input, { ...init, credentials: "include", headers: new Headers(headers()) });
};
export default fetchSSR;