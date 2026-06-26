"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import MultiLineGroupChart from "@/components/charts/MultiLineGroupChart"
import type { NormalizedMultiLineChartData } from "@/components/charts/multiLineGroupChartUtils"
import {
  defaultLast30DaysDateRange,
  formatDateTimeTick,
  formatFullVnd,
  formatRevenueAxis,
  multiplyChartSeriesValues,
  sumChartSeriesValues,
  transformVolumeChartApiData,
} from "@/components/charts/multiLineGroupChartUtils"
import { formatVnd } from "@/lib/formatMoney"
import { useGetKolDashboardVolumeChartQuery } from "@/services/api/dashboardApi"

function scaleRevenueForecastData(chartData: NormalizedMultiLineChartData) {
  return multiplyChartSeriesValues(chartData, {
    min: 1.3,
    max: 1.7,
    seedPrefix: "analytics-revenue-forecast",
  })
}

export default function RevenueForecastChart() {
  const searchParams = useSearchParams()
  const segment = searchParams.get("segment") || "all"
  const selectedGroupId = searchParams.get("groupId")

  const { data, isLoading, isFetching, error } = useGetKolDashboardVolumeChartQuery({
    startDate: defaultLast30DaysDateRange.from,
    endDate: defaultLast30DaysDateRange.to,
    segment,
  })

  const chartData = useMemo(() => scaleRevenueForecastData(transformVolumeChartApiData(data)), [data])

  return (
    <MultiLineGroupChart
      title="Doanh thu dự kiến 30D tiếp theo"
      summaryLabel={({ activeSeriesKeys, data }) => `${formatVnd(sumChartSeriesValues(data, activeSeriesKeys))} VNĐ`}
      initialActiveSeriesKey={selectedGroupId}
      data={chartData.data}
      series={chartData.series}
      xKey="timestamp"
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      variant="analytics"
      formatXAxis={formatDateTimeTick}
      formatYAxis={formatRevenueAxis}
      formatTooltipValue={formatFullVnd}
    />
  )
}
