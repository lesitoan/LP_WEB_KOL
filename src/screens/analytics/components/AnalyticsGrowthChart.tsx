import AnalyticsGrowthChartSkeleton from "@/components/skeletons/analytics/AnalyticsGrowthChartSkeleton"
import { useGetKolDashboardLatestVolumeGroupsQuery } from "@/services/api/dashboardApi"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { mapLatestVolumeGroupsToGrowthChartData } from "../constants"

const growthLegendItems = [
  { label: "Spot", color: "#D4A74A" },
  { label: "Future", color: "#F7F0A1" },
]

const growthLabelByKey: Record<string, string> = {
  spot: "Spot",
  future: "Future",
}

function formatVndAxis(value: number) {
  if (value === 0) return "0"
  return `${Math.round(value)}M`
}

function formatVndTooltip(value: number) {
  return `${Math.round(value).toLocaleString("en-US")} triệu VNĐ`
}

function formatFullVndTooltip(value: number) {
  return `${Math.round(value * 1_000_000).toLocaleString("en-US")} VNĐ`
}

type TooltipPayloadItem = {
  dataKey?: string | number
  value?: number | string
  color?: string
}

function getGrowthBarSize(itemCount: number) {
  if (itemCount <= 4) return 34
  if (itemCount <= 8) return 26
  if (itemCount <= 12) return 20
  if (itemCount <= 16) return 16
  if (itemCount <= 24) return 12

  return 8
}

function getXAxisTickInterval(itemCount: number) {
  return 0
}

function getGroupInitial(label: string) {
  return label.trim().charAt(0).toUpperCase()
}

function renderGrowthTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean
  label?: string
  payload?: any[]
}) {
  if (!active || !payload?.length) return null

  const rowData = payload[0]?.payload
  if (!rowData) return null

  return (
    <div className="rounded-[10px] border border-border bg-surface-2 px-3 py-2 text-sm shadow-lg">
      {label ? (
        <div
          className="mb-1 font-medium text-foreground max-w-[15ch] break-words whitespace-normal"
          title={label}
        >
          {label}
        </div>
      ) : null}
      <div className="space-y-1.5">
        <div className="whitespace-nowrap font-medium" style={{ color: "#D4A74A" }}>
          Spot: {formatFullVndTooltip(rowData.spot)}
        </div>
        <div className="whitespace-nowrap font-medium" style={{ color: "#F7F0A1" }}>
          Future: {formatFullVndTooltip(rowData.future)}
        </div>
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

function renderXAxisTick({
  x,
  y,
  payload,
}: {
  x?: number
  y?: number
  payload?: { value: string }
}) {
  const value = String(payload?.value ?? "")

  return (
    <text
      x={x}
      y={y}
      dy={12}
      fill="hsl(var(--muted-foreground))"
      fontSize={11}
      textAnchor="middle"
    >
      <title>{value}</title>
      {getGroupInitial(value)}
    </text>
  )
}

export default function AnalyticsGrowthChart() {
  const searchParams = useSearchParams()
  const selectedGroupId = searchParams.get("groupId")
  const { data, isFetching, isError } = useGetKolDashboardLatestVolumeGroupsQuery()
  
  const chartData = useMemo(() => {
    const rawData = mapLatestVolumeGroupsToGrowthChartData(data)
    const filteredData = selectedGroupId ? rawData.filter((item) => item.id === selectedGroupId) : rawData

    return filteredData.map((item) => {
      const spot = item.spot
      const future = item.future
      const smaller = Math.min(spot, future)
      const larger = Math.max(spot, future)
      return {
        ...item,
        smaller,
        diff: larger - smaller,
      }
    })
  }, [data, selectedGroupId])

  const barSize = getGrowthBarSize(chartData.length)
  const xAxisTickInterval = getXAxisTickInterval(chartData.length)
  const hasData = chartData.length > 0

  if (isFetching) {
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
        {!hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {isError ? "Không thể tải dữ liệu" : "Chưa có dữ liệu"}
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 30, right: 0, left: 0, bottom: 0 }} barCategoryGap="18%">
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.8} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={xAxisTickInterval}
              className="text-[10px] sm:text-[11px]"
              stroke="hsl(var(--muted-foreground))"
              tick={renderXAxisTick}
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
            <Bar dataKey="smaller" stackId="volume" fill="#D4A74A" barSize={barSize}>
              {chartData.map((entry, index) => {
                const isSpotLarger = entry.spot > entry.future
                const color = isSpotLarger ? "#F7F0A1" : "#D4A74A"
                return <Cell key={`cell-smaller-${index}`} fill={color} />
              })}
            </Bar>
            <Bar dataKey="diff" stackId="volume" fill="#F7F0A1" radius={[4, 4, 0, 0]} barSize={barSize}>
              {chartData.map((entry, index) => {
                const isSpotLarger = entry.spot > entry.future
                const color = isSpotLarger ? "#D4A74A" : "#F7F0A1"
                return <Cell key={`cell-diff-${index}`} fill={color} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}
