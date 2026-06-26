"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { RefObject } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import MultiLineChartSkeleton from "@/components/skeletons/MultiLineChartSkeleton"
import type { MultiLineChartPoint, MultiLineChartSeries } from "./multiLineGroupChartUtils"
import { formatCompactNumber, formatDateTimeTick, formatFullVnd } from "./multiLineGroupChartUtils"

type TooltipPayloadItem = {
  dataKey?: string | number
  value?: number | string | null
  color?: string
}

type MultiLineGroupChartProps = {
  title: string
  data: MultiLineChartPoint[]
  series: MultiLineChartSeries[]
  xKey: string
  summaryLabel?:
    | string
    | ((context: { activeSeriesKeys: string[]; data: MultiLineChartPoint[]; series: MultiLineChartSeries[] }) => string)
  initialActiveSeriesKey?: string | null
  unitLabel?: string
  isLoading?: boolean
  isFetching?: boolean
  error?: unknown
  emptyText?: string
  heightClassName?: string
  variant?: "dashboard" | "analytics"
  formatXAxis?: (value: string) => string
  formatYAxis?: (value: number) => string
  formatTooltipValue?: (value: number | null | undefined) => string
}

const chartVariantClassName = {
  dashboard: "mb-4 rounded-card bg-surface-2 p-5 md:p-6",
  analytics: "relative min-w-0 overflow-hidden rounded-card border border-border bg-surface-card p-4 sm:p-5",
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}...` : text
}

export default function MultiLineGroupChart({
  title,
  data,
  series,
  xKey,
  summaryLabel,
  initialActiveSeriesKey,
  unitLabel = "(VNĐ)",
  isLoading = false,
  isFetching = false,
  error,
  emptyText = "Chưa có dữ liệu",
  heightClassName,
  variant = "analytics",
  formatXAxis = formatDateTimeTick,
  formatYAxis = formatCompactNumber,
  formatTooltipValue = formatFullVnd,
}: MultiLineGroupChartProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const chartRef = useRef<HTMLDivElement>(null)
  const legendScrollRef = useRef<HTMLDivElement>(null)
  const [needsSlider, setNeedsSlider] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const seriesByKey = useMemo(
    () =>
      series.reduce<Record<string, MultiLineChartSeries>>((acc, item) => {
        acc[item.key] = item
        return acc
      }, {}),
    [series]
  )

  const activeSeriesKeys = useMemo(
    () => series.filter((item) => !hiddenSeries.has(item.key)).map((item) => item.key),
    [hiddenSeries, series]
  )

  const resolvedSummaryLabel = useMemo(() => {
    if (!summaryLabel) return undefined

    if (typeof summaryLabel === "string") {
      return summaryLabel
    }

    return summaryLabel({
      activeSeriesKeys,
      data,
      series,
    })
  }, [activeSeriesKeys, data, series, summaryLabel])

  const updateScrollState = useCallback(() => {
    const el = legendScrollRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
        setShowTooltip(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!initialActiveSeriesKey) {
      setHiddenSeries(new Set())
      return
    }

    const hasSelectedSeries = series.some((item) => item.key === initialActiveSeriesKey)

    if (!hasSelectedSeries) {
      setHiddenSeries(new Set())
      return
    }

    setHiddenSeries(new Set(series.filter((item) => item.key !== initialActiveSeriesKey).map((item) => item.key)))
  }, [initialActiveSeriesKey, series])

  useEffect(() => {
    if (!initialActiveSeriesKey) return

    const timer = window.setTimeout(() => {
      const selectedLegendItem = legendScrollRef.current?.querySelector<HTMLElement>(
        `[data-series-key="${CSS.escape(initialActiveSeriesKey)}"]`
      )

      selectedLegendItem?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }, 80)

    return () => window.clearTimeout(timer)
  }, [initialActiveSeriesKey, series])

  useEffect(() => {
    const el = legendScrollRef.current
    if (!el) return

    const checkOverflow = () => {
      setNeedsSlider(el.scrollWidth > el.clientWidth + 1)
      updateScrollState()
    }

    const timer = window.setTimeout(checkOverflow, 50)
    const observer = new ResizeObserver(checkOverflow)
    observer.observe(el)
    el.addEventListener("scroll", updateScrollState)

    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
      el.removeEventListener("scroll", updateScrollState)
    }
  }, [series.length, updateScrollState])

  const scrollLegend = (direction: "left" | "right") => {
    const el = legendScrollRef.current
    if (!el) return

    el.scrollBy({
      left: direction === "left" ? -150 : 150,
      behavior: "smooth",
    })
  }

  const toggleSeries = (key: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev)

      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      return next
    })
  }

  const renderTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
    if (!active || !payload?.length) return null

    return (
      <div className="rounded-lg border border-border-strong bg-surface-3 px-3 py-2 text-sm shadow-lg">
        {label ? <div className="mb-2 text-xs text-zinc-400">{formatXAxis(label)}</div> : null}
        <div className="max-h-[120px] space-y-1.5 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-600/70 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500 [scrollbar-width:thin] [scrollbar-color:rgba(113,113,122,0.5)_transparent]">
          {payload.map((item) => {
            const dataKey = String(item.dataKey ?? "")
            const rawValue = typeof item.value === "number" ? item.value : item.value == null ? null : Number(item.value)
            const value = rawValue != null && Number.isFinite(rawValue) ? rawValue : null
            const meta = seriesByKey[dataKey]

            return (
              <div
                key={dataKey}
                className="max-w-[180px] break-words font-medium leading-tight lg:max-w-[280px]"
                style={{ color: meta?.color || item.color }}
              >
                {meta?.label ?? dataKey}: {formatTooltipValue(value)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <MultiLineChartSkeleton title={title} />
  }

  const resolvedHeightClassName = heightClassName ?? (variant === "dashboard" ? "h-[300px]" : "h-[240px] sm:h-[270px]")

  return (
    <section className={chartVariantClassName[variant]}>
      <div className={variant === "dashboard" ? "mb-6 flex items-center justify-between" : "mb-2"}>
        <h2 className={variant === "dashboard" ? "text-base font-medium text-foreground" : "min-w-0 text-base font-medium"}>{title}</h2>
      </div>

      {resolvedSummaryLabel ? (
        <div className="absolute right-4 top-[56px] z-10 inline-flex shrink-0 items-center gap-1 text-xs font-medium leading-none text-foreground sm:right-5 sm:top-[58px] sm:gap-1.5 sm:text-[15px]">
          <span>{resolvedSummaryLabel}</span>
          <img src="/images/bitcoin_logo.png" alt="" aria-hidden="true" className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4" />
        </div>
      ) : null}

      {variant === "dashboard" && !error && data.length > 0 ? (
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="shrink-0 text-xs text-zinc-500">{unitLabel}</div>
          <LegendContent
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            hiddenSeries={hiddenSeries}
            needsSlider={needsSlider}
            onScroll={scrollLegend}
            onToggle={toggleSeries}
            refEl={legendScrollRef}
            series={series}
          />
        </div>
      ) : null}

      <div
        ref={chartRef}
        className={`relative min-w-0 w-full transition-opacity duration-200 ${resolvedHeightClassName} ${isFetching ? "opacity-60" : "opacity-100"}`}
        onClick={() => setShowTooltip(true)}
      >
        {variant === "analytics" ? <div className="absolute left-0 top-0 text-[11px] font-medium text-muted-foreground">{unitLabel}</div> : null}

        {error ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-red-400">Không thể tải dữ liệu biểu đồ</div>
        ) : data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">{emptyText}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={variant === "dashboard" ? { top: 4, right: 16, left: 0, bottom: 0 } : { top: 28, right: 18, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={variant === "dashboard" ? "hsl(var(--border-strong))" : "hsl(var(--border))"} strokeOpacity={0.8} />
              <XAxis
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tickMargin={variant === "dashboard" ? 14 : 10}
                minTickGap={variant === "dashboard" ? 60 : undefined}
                interval={variant === "dashboard" ? "preserveStartEnd" : undefined}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickFormatter={(value) => formatXAxis(String(value))}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                width={variant === "dashboard" ? 46 : 48}
                domain={[0, "auto"]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={variant === "dashboard" ? 12 : 11}
                tickFormatter={(value) => formatYAxis(Number(value))}
              />
              <Tooltip
                cursor={{ stroke: "hsl(var(--border-strong))" }}
                content={(props) => renderTooltip(props as { active?: boolean; payload?: TooltipPayloadItem[]; label?: string })}
                trigger="click"
                wrapperStyle={{
                  pointerEvents: "auto",
                  visibility: showTooltip ? "visible" : "hidden",
                }}
              />
              {series.map((item) => (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  stroke={item.color}
                  strokeWidth={variant === "dashboard" ? 2 : 2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  connectNulls={false}
                  hide={hiddenSeries.has(item.key)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {variant === "analytics" && !error && data.length > 0 ? (
        <div className="mt-3 flex min-w-0 justify-center text-xs font-normal text-foreground sm:text-sm">
          <LegendContent
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            hiddenSeries={hiddenSeries}
            needsSlider={needsSlider}
            onScroll={scrollLegend}
            onToggle={toggleSeries}
            refEl={legendScrollRef}
            series={series}
            placement="bottom"
          />
        </div>
      ) : null}
    </section>
  )
}

type LegendContentProps = {
  canScrollLeft: boolean
  canScrollRight: boolean
  hiddenSeries: Set<string>
  needsSlider: boolean
  onScroll: (direction: "left" | "right") => void
  onToggle: (key: string) => void
  refEl: RefObject<HTMLDivElement>
  series: MultiLineChartSeries[]
  placement?: "top" | "bottom"
}

function LegendContent({
  canScrollLeft,
  canScrollRight,
  hiddenSeries,
  needsSlider,
  onScroll,
  onToggle,
  refEl,
  series,
  placement = "top",
}: LegendContentProps) {
  const isBottom = placement === "bottom"

  return (
    <div className={`flex min-w-0 items-center gap-2 ${isBottom ? "w-full justify-center px-2 sm:px-3" : "lg:ml-16"}`}>
      {needsSlider ? (
        <button
          type="button"
          onClick={() => onScroll("left")}
          disabled={!canScrollLeft}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border-strong bg-surface-3 text-zinc-400 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      ) : null}

      <div
        ref={refEl}
        className={`flex min-w-0 items-center gap-3.5 overflow-x-hidden ${isBottom ? "mx-1 flex-1 px-1 sm:mx-2 sm:px-2" : ""}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {series.map((item) => {
          const isHidden = hiddenSeries.has(item.key)

          return (
            <button
              key={item.key}
              type="button"
              data-series-key={item.key}
              className={`flex shrink-0 cursor-pointer items-center gap-1.5 text-[8px] font-normal transition-opacity sm:text-[10px] md:text-sm ${isHidden ? "opacity-50" : "text-zinc-200"}`}
              onClick={() => onToggle(item.key)}
              title={item.label}
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className={`whitespace-nowrap ${isHidden ? "line-through text-zinc-500" : "text-zinc-200"}`}>{truncate(item.label, 15)}</span>
            </button>
          )
        })}
      </div>

      {needsSlider ? (
        <button
          type="button"
          onClick={() => onScroll("right")}
          disabled={!canScrollRight}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border-strong bg-surface-3 text-zinc-400 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  )
}
