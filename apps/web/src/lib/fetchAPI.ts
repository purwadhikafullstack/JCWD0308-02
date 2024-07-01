const fetchAPI = (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  const modifiedInit: RequestInit = { ...init, credentials: init.credentials ?? 'include' };
  return fetch(input, modifiedInit);
};

export default fetchAPI;