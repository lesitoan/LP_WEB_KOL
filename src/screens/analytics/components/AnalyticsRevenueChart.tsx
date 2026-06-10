import AnalyticsRevenueChartSkeleton from "@/components/skeletons/analytics/AnalyticsRevenueChartSkeleton"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { revenueData } from "../constants"
import { useFakeAnalyticsLoading } from "./useFakeAnalyticsLoading"

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(value)
}


export default function AnalyticsRevenueChart({ title }: { title: string }) {
  const isLoading = useFakeAnalyticsLoading()

  if (isLoading) {
    return <AnalyticsRevenueChartSkeleton title={title} />
  }

  return (
    <section className="rounded-[14px] border border-border bg-[#171717] p-4 sm:p-5">
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      <div className="h-[240px] sm:h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.8} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-[11px]"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
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
              formatter={(value: number, name: string) => [
                formatUsd(value),
                name === "current" ? "Doanh thu" : name === "target" ? "Target" : "Nền",
              ]}
            />
            <Line type="monotone" dataKey="current" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="target" stroke="#facc15" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="baseline" stroke="#d4d4d8" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
