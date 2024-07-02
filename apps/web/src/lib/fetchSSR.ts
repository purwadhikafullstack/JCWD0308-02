import { cookies } from "next/headers";

const fetchSSR = (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {

  const modifiedInit: RequestInit = {
    ...init,
    credentials: init.credentials ?? 'include',
    headers: {
      Cookie: cookies().toString()
    }
  };

  return fetch(input, modifiedInit);
};

export default fetchSSR;