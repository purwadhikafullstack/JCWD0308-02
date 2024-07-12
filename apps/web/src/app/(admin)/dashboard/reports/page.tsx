"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { fetchStockMutations } from "@/lib/fetch-api/report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { StockMutation } from "@/lib/types/reports";
import { Store } from "@/lib/types/store";
import { getAllStores, getSelectedStore } from "@/lib/fetch-api/store/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/fetch-api/user/client";

const chartConfig = {
  stockIn: { label: "Stock In", color: "#2563eb" },
  stockOut: { label: "Stock Out", color: "#ff0000" },
  orders: { label: "Orders", color: "#00ff00" },
} satisfies ChartConfig;

const StockMutationChart: React.FC = () => {
  const [yearMonth, setYearMonth] = React.useState("2024-07");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(30);
  const [storeId, setStoreId] = React.useState<string | undefined>(undefined);
  const [productSlug, setProductSlug] = React.useState<string | undefined>(undefined);
  const [storeSlug, setStoreSlug] = React.useState<string | undefined>(undefined);
  const [data, setData] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("stockIn");
  const [products, setProducts] = React.useState<{ title: string; slug: string }[]>([]);
  const [stores, setStores] = React.useState<Store[]>([]);

  const userProfile = useSuspenseQuery({ queryKey: ["user-profile"], queryFn: getUserProfile });
  const selectedStore = useSuspenseQuery({ queryKey: ["selected-store"], queryFn: getSelectedStore });

  const isStoreAdmin = userProfile.data?.user?.role === "STORE_ADMIN";
  const selectedStoreId = selectedStore.data?.store?.id;
  const selectedStoreName = selectedStore.data?.store?.name;

  const fetchData = React.useCallback(async () => {
    try {
      const [storeData, { data, totalCount, products }] = await Promise.all([
        getAllStores(),
        fetchStockMutations(yearMonth, page, perPage, storeId, productSlug, storeSlug),
      ]);
      setStores(storeData.data);
      setData(formatChartData(data, yearMonth));
      setTotal(totalCount);
      setProducts(products);
    } catch (error) {
      console.error("Failed to fetch stock mutations:", error);
    }
  }, [yearMonth, page, perPage, storeId, productSlug, storeSlug]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    if (isStoreAdmin && selectedStoreId) {
      setStoreId(selectedStoreId);
      setStoreSlug(selectedStore.data?.store?.slug);
    }
  }, [isStoreAdmin, selectedStoreId, selectedStore.data?.store?.slug]);

  const formatChartData = (mutations: StockMutation[], yearMonth: string) => {
    const [year, month] = yearMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const chartData = Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month - 1, i + 1).toISOString().split("T")[0],
      stockIn: 0,
      stockOut: 0,
      orders: 0,
    }));
    mutations.forEach((mutation) => {
      const date = new Date(mutation.createdAt).toISOString().split("T")[0];
      const dayData = chartData.find((d) => d.date === date);
      if (dayData) {
        if (mutation.mutationType === "STOCK_IN") dayData.stockIn += mutation.amount;
        else if (mutation.mutationType === "STOCK_OUT") dayData.stockOut += mutation.amount;
        else if (mutation.mutationType === "ORDER") dayData.orders += mutation.amount;
      }
    });
    return chartData;
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Stock Mutations</CardTitle>
          <CardDescription>Showing stock mutations data</CardDescription>
        </div>
        <div className="flex">
          {["stockIn", "stockOut", "orders"].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key as keyof typeof chartConfig)}
            >
              <span className="text-xs text-muted-foreground">{chartConfig[key as keyof typeof chartConfig].label}</span>
              <span className="text-lg font-bold leading-none sm:text-3xl">{data.reduce((acc, curr) => acc + curr[key as keyof typeof chartConfig], 0)}</span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="mb-4">
          <input type="month" value={yearMonth} onChange={(e) => setYearMonth(e.target.value)} className="border p-2 rounded w-full" />
          <select value={productSlug} onChange={(e) => setProductSlug(e.target.value)} className="border p-2 rounded w-full mt-2">
            <option value="">All Products</option>
            {products.map((product) => (
              <option key={product.slug} value={product.slug}>{product.title}</option>
            ))}
          </select>
          <select value={storeSlug} onChange={(e) => setStoreSlug(e.target.value)} className="border p-2 rounded w-full mt-2" disabled={isStoreAdmin}>
            <option value="">{isStoreAdmin ? selectedStoreName : "All Stores"}</option>
            {stores.map((store) => (
              <option key={store.slug} value={store.slug}>{store.name}</option>
            ))}
          </select>
          <input type="text" value={storeId} onChange={(e) => setStoreId(e.target.value)} placeholder="Store ID" className="border p-2 rounded w-full mt-2" disabled />
        </div>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={8} tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
            <YAxis />
            <Tooltip content={({ payload, label }) => payload?.length ? (
              <div className="bg-white p-2 border rounded shadow">
                <p>{label}</p>
                {payload.map((entry, index) => <p key={index} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>)}
              </div>
            ) : null} />
            <Legend />
            <Bar dataKey="stockIn" fill={chartConfig.stockIn.color} />
            <Bar dataKey="stockOut" fill={chartConfig.stockOut.color} />
            <Bar dataKey="orders" fill={chartConfig.orders.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default StockMutationChart;
