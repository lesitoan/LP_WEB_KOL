"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useGetCashbackCommissionChartQuery } from "@/services/api/cashbackApi";
import { VolumeMembersChartSkeleton } from "@/components/skeletons/VolumeMembersChartSkeleton";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const PERIODS: Array<{ value: 7 | 30 | 90; label: string }> = [
  { value: 7, label: "7 ngày" },
  { value: 30, label: "30 ngày" },
  { value: 90, label: "90 ngày" },
];

export default function VolumeMembersChart() {
  const [period, setPeriod] = useState<7 | 30 | 90>(30);
  const { data = [], isLoading, isFetching } = useGetCashbackCommissionChartQuery(period);

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold">Biểu đồ Hoa hồng & Cashback</h3>
        <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface-2 p-1">
          {PERIODS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setPeriod(item.value)}
              className={`h-7 px-3 rounded-lg text-xs font-medium transition-colors ${
                period === item.value
                  ? "bg-surface-1 text-foreground shadow-[0_0_0_1px_hsl(var(--border))]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              disabled={isFetching}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        {isLoading ? (
          <VolumeMembersChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="commissionFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cashbackFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[11px]"
                stroke="hsl(var(--muted-foreground))"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={56}
                className="text-[11px]"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => formatUsd(Number(value))}
              />

              <Tooltip
                contentStyle={{
                  background: "hsl(var(--surface-2))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 10,
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                formatter={(value: number, name: string) => [formatUsd(value), name === "cashback" ? "Cashback" : "Hoa hồng"]}
              />

              <Area
                type="monotone"
                dataKey="cashback"
                name="cashback"
                stroke="hsl(var(--success))"
                fill="url(#cashbackFill)"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="commission"
                name="commission"
                stroke="hsl(var(--warning))"
                fill="url(#commissionFill)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-2 flex items-center justify-center gap-5 text-sm font-medium">
        <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-[3px] bg-success" />Cashback</span>
        <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-[3px] bg-warning" />Hoa hồng</span>
      </div>
    </div>
  );
}
