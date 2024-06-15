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
    origin: String(origin),
    destination: String(destination),
    weight: String(weight),
    courier,
  });
  console.log('Request Body:', body.toString());

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: body.toString(),
  });
  console.log('Response Status:', response.status);

  if (!response.ok) {
    throw new ResponseError(
      response.status,
      'Error fetching shipping cost from RajaOngkir',
    );
  }

  const data = await response.json();
  console.log(data);
  const cost = data.rajaongkir.results[0].costs[0].cost[0].value;
  const estimation = data.rajaongkir.results[0].costs[0].cost[0].etd;

  return { cost, estimation };
};
