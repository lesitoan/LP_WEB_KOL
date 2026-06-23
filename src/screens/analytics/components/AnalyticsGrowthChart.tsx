import AnalyticsGrowthChartSkeleton from "@/components/skeletons/analytics/AnalyticsGrowthChartSkeleton"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { growthData } from "../constants"
import { useFakeAnalyticsLoading } from "./useFakeAnalyticsLoading"

const growthLegendItems = [
  { label: "Future", color: "#F7F0A1" },
  { label: "Spot", color: "#D4A74A" },
  { label: "Copy Trade", color: "#9B692C" },
]

const growthLabelByKey: Record<string, string> = {
  warning: "Future",
  members: "Spot",
  volume: "Copy Trade",
}

function formatVndAxis(value: number) {
  if (value === 0) return "0"
  return `${Math.round(value)}M`
}

function formatVndTooltip(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")} triệu VNĐ`
}

function formatFullVndTooltip(value: number) {
  return `${Math.round(value * 1_000_000).toLocaleString("vi-VN")} VNĐ`
}

type TooltipPayloadItem = {
  dataKey?: string | number
  value?: number | string
  color?: string
}

function renderGrowthTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean
  label?: string
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-[10px] border border-border bg-surface-2 px-3 py-2 text-sm shadow-lg">
      {label ? <div className="mb-1 font-medium text-foreground">{label}</div> : null}
      <div className="space-y-1.5">
        {payload.map((item) => {
          const dataKey = String(item.dataKey ?? "")
          const value = Number(item.value ?? 0)

          return (
            <div key={dataKey} className="whitespace-nowrap font-medium" style={{ color: item.color }}>
              {growthLabelByKey[dataKey] ?? dataKey}: {formatFullVndTooltip(value)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function renderLeftAlignedYAxisTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: number } }) {
  return (
    <text
      x={Math.max(0, (x ?? 0) - 58)}
      y={y}
      dy={4}
      fill="hsl(var(--muted-foreground))"
      fontSize={11}
      textAnchor="start"
    >
      {formatVndAxis(Number(payload?.value ?? 0))}
    </text>
  )
}

export default function AnalyticsGrowthChart() {
  const isLoading = useFakeAnalyticsLoading()

  if (isLoading) {
    return <AnalyticsGrowthChartSkeleton />
  }

  return (
    <section className="rounded-card border border-border bg-surface-card px-6 py-4 sm:py-5">
      <h2 className="mb-3 text-base font-medium">
        So sánh tốc độ tăng trưởng volume (theo nhóm)
      </h2>
      <div className="relative h-[290px]">
        <div className="absolute left-0 top-0 text-left text-[11px] font-medium text-muted-foreground">(VNĐ)</div>
        <div className="absolute right-0 top-1 z-10 flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5 text-xs font-normal text-foreground sm:gap-x-5 sm:gap-y-2 sm:text-sm">
          {growthLegendItems.map((item) => (
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={growthData} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.8} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0}
              className="text-[10px] sm:text-[11px]"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={58}
              className="text-[11px]"
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => formatVndAxis(Number(value))}
              tick={renderLeftAlignedYAxisTick}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              content={renderGrowthTooltip}
            />
            <Bar dataKey="volume" stackId="growth" fill="#9B692C" radius={[0, 0, 4, 4]} barSize={41} />
            <Bar dataKey="members" stackId="growth" fill="#D4A74A" barSize={41} />
            <Bar dataKey="warning" stackId="growth" fill="#F7F0A1" radius={[4, 4, 0, 0]} barSize={41} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
