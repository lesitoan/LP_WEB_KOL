"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import MultiLineGroupChart from "@/components/charts/MultiLineGroupChart"
import {
  defaultLast30DaysDateRange,
  formatDateTimeTick,
  formatFullVnd,
  formatRevenueAxis,
  sumChartSeriesValues,
  transformVolumeChartApiData,
} from "@/components/charts/multiLineGroupChartUtils"
import { formatVnd } from "@/lib/formatMoney"
import { useGetKolDashboardVolumeChartQuery } from "@/services/api/dashboardApi"

export default function RevenueStatisticsChart() {
  const searchParams = useSearchParams()
  const segment = searchParams.get("segment") || "all"
  const selectedGroupId = searchParams.get("groupId")

  const { data, isLoading, isFetching, error } = useGetKolDashboardVolumeChartQuery({
    startDate: defaultLast30DaysDateRange.from,
    endDate: defaultLast30DaysDateRange.to,
    segment,
  })

  const chartData = useMemo(() => transformVolumeChartApiData(data), [data])

  return (
    <MultiLineGroupChart
      title="Thống kê doanh thu 30D"
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
