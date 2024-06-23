
const fetchAPI = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  return fetch(input, { ...init, credentials: "include" });
};
export default fetchAPI;