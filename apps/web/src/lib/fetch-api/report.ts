import axios from "axios";
import { API_URL } from "./lib"; 
import { StockMutation } from "../types/reports";

export const fetchStockMutations = async (
  yearMonth: string, 
  page: number = 1,
  perPage: number = 10,
  storeId?: string,  
  filters: any = {}
): Promise<{ data: StockMutation[]; totalCount: number }> => {
  const params: any = { yearMonth, page: page.toString(), perPage: perPage.toString(), ...filters };
  if (storeId) {
    params.storeId = storeId;
  }

  const query = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_URL}/report/stock-mutations?${query}`, {
    withCredentials: true,
  });

  if (res.status !== 200) {
    throw new Error("Failed to fetch stock mutations");
  }
  return res.data;
};
