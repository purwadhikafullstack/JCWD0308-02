import axios from 'axios';

export const calculateShippingCost = async (
  origin: number,
  destination: number,
  weight: number,
  courier: string,
) => {
  const url = 'https://api.rajaongkir.com/starter/cost';
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error('There is no API KEY');
    return;
  }

  const headers = {
    key: apiKey,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const body = new URLSearchParams({
    origin: String(origin),
    destination: String(destination),
    weight: String(weight),
    courier,
  });

  console.log('Request Body:', body.toString());

  try {
    const response = await axios.post(url, body, { headers });
    console.log('Response Status:', response.status);

    const data = response.data;
    console.log(data);

    const cost = data.rajaongkir.results[0].costs[0].cost[0].value;
    const estimation = data.rajaongkir.results[0].costs[0].cost[0].etd;

    return { cost, estimation };
  } catch (error) {
    console.error('Error calculating shipping cost:', error);
    throw error;
  }
};
