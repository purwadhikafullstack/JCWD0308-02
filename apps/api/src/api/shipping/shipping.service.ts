import { ResponseError } from '@/utils/error.response.js';

export const calculateShippingCost = async (
  origin: number,
  destination: number,
  weight: number,
  courier: string,
) => {
  const url = 'https://api.rajaongkir.com/starter/cost';
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new ResponseError(500, 'API key for RajaOngkir is not set');
  }
  const headers = {
    key: apiKey,
    'content-type': 'application/x-www-form-urlencoded',
  };
  const body = new URLSearchParams({
    origin: origin.toString(),
    destination: destination.toString(),
    weight: weight.toString(),
    courier: courier,
  });
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: body.toString(),
  });

  if (!response.ok) {
    throw new ResponseError(
      response.status,
      'Error fetching shipping cost from RajaOngkir',
    );
  }

  const data = await response.json();
  const cost = data.rajaongkir.results[0].costs[0].cost[0].value;

  return cost;
};
