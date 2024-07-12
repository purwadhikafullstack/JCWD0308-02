import axios from "axios";
import { API_URL } from "./lib";
import { StockMutation } from "../types/reports";

export const fetchStockMutations = async (
  yearMonth: string,
  page: number = 1,
  perPage: number = 30,
  storeId?: string,
  productSlug?: string,
  storeSlug?: string
): Promise<{ data: StockMutation[]; totalCount: number; products: { title: string; slug: string }[] }> => {
  const params: any = { yearMonth, page: page.toString(), perPage: perPage.toString() };

  if (storeId) {
    params.storeId = storeId;
  }
  if (productSlug) {
    params.productSlug = productSlug;
  }
  if (storeSlug) {
    params.storeSlug = storeSlug;
  }

  const query = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_URL}/report/stock-mutations?${query}`, {
    withCredentials: true,
  });

  if (res.status !== 200) {
    throw new Error("Failed to fetch stock mutations");
  }

  const products = res.data.data.map((mutation: StockMutation) => ({
    title: mutation.stock.product.title,
    slug: mutation.stock.product.slug,
  }));

  const uniqueProducts = Array.from(new Set(products.map((p: { slug: string; }) => p.slug)))
    .map((slug) => products.find((p: { slug: string; }) => p.slug === slug) as { title: string; slug: string });

  return { ...res.data, products: uniqueProducts };
};
