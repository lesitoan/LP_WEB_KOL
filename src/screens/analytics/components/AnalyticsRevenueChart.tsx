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

const lineLegendItems = [
  { label: "VIP Platinum", color: "#d4d4d8" },
  { label: "Gold Traders", color: "#facc15" },
  { label: "Silver Group", color: "hsl(var(--brand))" },
]

export function formatVnd(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")} VNĐ`
}

function formatVndAxis(value: number) {
  if (value === 0) return "0"
  if (value >= 1_000_000_000) return `${Number((value / 1_000_000_000).toFixed(1))} tỷ`
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M`
  return `${Math.round(value / 1000)}M`
}


type AnalyticsRevenueChartProps = {
  title: string
  summaryLabel?: string
}

export default function AnalyticsRevenueChart({ title, summaryLabel }: AnalyticsRevenueChartProps) {
  const isLoading = useFakeAnalyticsLoading()

  if (isLoading) {
    return <AnalyticsRevenueChartSkeleton title={title} />
  }

  return (
    <section className="relative rounded-[14px] border border-border bg-[#171717] p-4 sm:p-5">
      <div className="mb-2">
        <h2 className="min-w-0 text-base font-medium">{title}</h2>
      </div>
      {summaryLabel ? (
        <div className="absolute right-4 top-[56px] z-10 inline-flex shrink-0 items-center gap-1 text-xs font-medium leading-none text-foreground sm:right-5 sm:top-[58px] sm:gap-1.5 sm:text-[15px]">
          <span>{summaryLabel}</span>
          <img src="/images/bitcoin_logo.png" alt="" aria-hidden="true" className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4" />
        </div>
      ) : null}
      <div className="relative h-[240px] sm:h-[270px]">
        <div className="absolute left-0 top-0 text-[11px] font-medium text-muted-foreground">(VNĐ)</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData} margin={{ top: 28, right: 8, left: 0, bottom: 0 }}>
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
              tickFormatter={(value) => formatVndAxis(Number(value))}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--surface-2))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 10,
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              formatter={(value: number, name: string) => [
                formatVnd(value),
                name === "current" ? "Doanh thu" : name === "target" ? "Target" : "Nền",
              ]}
            />
            <Line type="monotone" dataKey="current" stroke="hsl(var(--brand))" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="target" stroke="#facc15" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="baseline" stroke="#d4d4d8" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-normal text-foreground sm:gap-x-5 sm:gap-y-2 sm:text-sm">
        {lineLegendItems.map((item) => (
          <div key={item.label} className="inline-flex items-center gap-1.5 sm:gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
