import { headers } from "next/headers";

const fetchSSR = (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  
  const modifiedInit: RequestInit = {
    ...init,
    credentials: init.credentials ?? 'include',
    headers: new Headers(headers()),
  };

  return fetch(input, modifiedInit);
};

export default fetchSSR;