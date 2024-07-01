import axios from 'axios';

export const fetchStocks = async (
  page: number = 1,
  limit: number = 8,
  filters: any = {},
) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  }).toString();
  const res = await axios.get(`http://localhost:8000/api/stock?${query}`, {
    withCredentials: true,
  });
  if (res.status !== 200) {
    throw new Error('Failed to fetch stocks');
  }
  return res.data;
};

export const fetchStockById = async (id: string) => {
  const response = await axios.get(`http://localhost:8000/api/stock/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const createStock = async (stockData: any) => {
  const response = await axios.post(
    `http://localhost:8000/api/stock`,
    stockData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    },
  );
  return response.data;
};

export const updateStockAmount = async (id: string, stockData: any) => {
  const response = await axios.put(
    `http://localhost:8000/api/stock/${id}`,
    stockData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    },
  );
  return response.data;
};

export const deleteStock = async (id: string) => {
  const response = await axios.delete(`http://localhost:8000/api/stock/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const postStockId = async (productId: string, addressId: string) => {
  const res = await axios.post(
    `http://localhost:8000/api/stock/post-stock-id`,
    { productId, addressId },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    },
  );
  return res.data;
};
