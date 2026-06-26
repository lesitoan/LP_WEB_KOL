import type { GroupItem, KolDashboardVolumeChartData } from "@/types/api"
import { formatVnd } from "@/lib/formatMoney"

export const DEFAULT_CHART_COLORS = [
  "#f4f4f5",
  "#facc15",
  "#15C982",
  "#3b82f6",
  "#ec4899",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
]

export type MultiLineChartPoint = Record<string, string | number | null>

export type MultiLineChartSeries = {
  key: string
  label: string
  color: string
}

export type NormalizedMultiLineChartData = {
  data: MultiLineChartPoint[]
  series: MultiLineChartSeries[]
}

export function getChartColor(index: number) {
  if (index < DEFAULT_CHART_COLORS.length) {
    return DEFAULT_CHART_COLORS[index]
  }

  const hue = (index * 137.508) % 360
  return `hsl(${hue}, 70%, 55%)`
}

export function formatCompactNumber(value: number) {
  if (value === 0) return "0"
  if (value >= 1_000_000_000) return `${Number((value / 1_000_000_000).toFixed(1))}B`
  if (value >= 1_000_000) return `${Number((value / 1_000_000).toFixed(1))}M`
  if (value >= 1_000) return `${Number((value / 1_000).toFixed(1))}K`
  return value.toString()
}

export function formatRevenueAxis(value: number) {
  if (value === 0) return "0"
  if (value >= 1_000_000_000) return `${Number((value / 1_000_000_000).toFixed(1))} tỷ`
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M`
  return `${Math.round(value / 1_000)}M`
}

export function formatDateTimeTick(tickItem: string) {
  if (!tickItem) return ""

  const date = new Date(tickItem)
  if (Number.isNaN(date.getTime())) return tickItem

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(date)
}

export function formatFullVnd(value: number | null | undefined) {
  if (value == null) return "Không có dữ liệu"
  return `${formatVnd(value)} VNĐ`
}

export function sumChartSeriesValues(data: MultiLineChartPoint[], activeSeriesKeys: string[]) {
  const activeKeySet = new Set(activeSeriesKeys)

  return data.reduce((total, point) => {
    return (
      total +
      Object.entries(point).reduce((pointTotal, [key, value]) => {
        if (!activeKeySet.has(key) || typeof value !== "number") {
          return pointTotal
        }

        return pointTotal + value
      }, 0)
    )
  }, 0)
}

function buildGroupTitleById(groups: GroupItem[] = []) {
  return groups.reduce<Record<string, string>>((acc, group) => {
    const title = group.title?.trim()

    if (title) {
      acc[group.id] = title
    }

    return acc
  }, {})
}

export function transformVolumeChartApiData(
  apiData: KolDashboardVolumeChartData | null | undefined,
  groups: GroupItem[] = []
): NormalizedMultiLineChartData {
  if (!apiData?.points?.length || !apiData.series?.length) {
    return { data: [], series: [] }
  }

  const groupTitleById = buildGroupTitleById(groups)
  const data: MultiLineChartPoint[] = apiData.points.map((point) => ({
    timestamp: point,
  }))

  const series = apiData.series
    .map((item, index) => {
      const key = item.group.id

      item.values.forEach((value, pointIndex) => {
        if (data[pointIndex]) {
          data[pointIndex][key] = value
        }
      })

      return {
        key,
        label: groupTitleById[key] ?? "",
        color: getChartColor(index),
      }
    })
    .filter((item) => item.label !== "")

  return { data, series }
}

export function transformFlatChartData(
  flatData: MultiLineChartPoint[],
  series: Array<Omit<MultiLineChartSeries, "color"> & { color?: string }>
): NormalizedMultiLineChartData {
  return {
    data: flatData,
    series: series.map((item, index) => ({
      ...item,
      color: item.color ?? getChartColor(index),
    })),
  }
}

function getStableRatio(seed: string, min: number, max: number) {
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
  }

  const normalized = (hash % 1000) / 1000
  return min + normalized * (max - min)
}

export function multiplyChartSeriesValues(
  chartData: NormalizedMultiLineChartData,
  options: { min: number; max: number; seedPrefix?: string }
): NormalizedMultiLineChartData {
  const ratiosByKey = chartData.series.reduce<Record<string, number>>((acc, item) => {
    acc[item.key] = getStableRatio(`${options.seedPrefix ?? "forecast"}:${item.key}`, options.min, options.max)
    return acc
  }, {})

  return {
    series: chartData.series,
    data: chartData.data.map((point) => {
      const nextPoint: MultiLineChartPoint = { ...point }

      chartData.series.forEach((item) => {
        const value = point[item.key]

        if (typeof value === "number") {
          nextPoint[item.key] = Math.round(value * ratiosByKey[item.key])
        }
      })

      return nextPoint
    }),
  }
}

export const defaultLast30DaysDateRange = {
  from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
  to: new Date().toISOString().split("T")[0],
}
