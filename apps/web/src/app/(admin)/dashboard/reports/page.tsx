"use client"

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { fetchStockMutations } from "@/lib/fetch-api/report";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { StockMutation } from "@/lib/types/reports";

export const description = "An interactive bar chart";

const chartConfig = {
  stockIn: {
    label: "Stock In",
    color: "#2563eb",
  },
  stockOut: {
    label: "Stock Out",
    color: "#ff0000",
  },
  orders: {
    label: "Orders",
    color: "#00ff00",
  },
} satisfies ChartConfig;

const StockMutationChart: React.FC = () => {
  const [yearMonth, setYearMonth] = React.useState("2024-06");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(30);
  const [storeId, setStoreId] = React.useState<string | undefined>(undefined);
  const [productSlug, setProductSlug] = React.useState<string | undefined>(undefined);
  const [storeSlug, setStoreSlug] = React.useState<string | undefined>(undefined);
  const [data, setData] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("stockIn");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, totalCount } = await fetchStockMutations(yearMonth, page, perPage, storeId, productSlug, storeSlug);
        const formattedData = formatChartData(data, yearMonth);
        setData(formattedData);
        setTotal(totalCount);
      } catch (error) {
        console.error("Failed to fetch stock mutations:", error);
      }
    };

    fetchData();
  }, [yearMonth, page, perPage, storeId, productSlug, storeSlug]);

  const formatChartData = (mutations: StockMutation[], yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const chartData = Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month - 1, i + 1).toISOString().split('T')[0],
      stockIn: 0,
      stockOut: 0,
      orders: 0,
    }));

    mutations.forEach((mutation) => {
      const date = new Date(mutation.createdAt).toISOString().split('T')[0];
      const dayData = chartData.find(d => d.date === date);
      if (dayData) {
        if (mutation.mutationType === 'STOCK_IN') {
          dayData.stockIn += mutation.amount;
        } else if (mutation.mutationType === 'STOCK_OUT') {
          dayData.stockOut += mutation.amount;
        } else if (mutation.mutationType === 'ORDER') {
          dayData.orders += mutation.amount;
        }
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
          {["stockIn", "stockOut", "orders"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {data.reduce((acc, curr) => acc + curr[chart], 0)}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="mb-4">
          <input
            type="month"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            placeholder="Product Slug"
            className="border p-2 rounded w-full mt-2"
          />
          <input
            type="text"
            value={storeSlug}
            onChange={(e) => setStoreSlug(e.target.value)}
            placeholder="Store Slug"
            className="border p-2 rounded w-full mt-2"
          />
          <input
            type="text"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            placeholder="Store ID"
            className="border p-2 rounded w-full mt-2"
            disabled={!storeId}
          />
        </div>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis />
            <Tooltip
              content={({ payload, label }) => {
                if (payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p>{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                          {entry.name}: {entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
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
