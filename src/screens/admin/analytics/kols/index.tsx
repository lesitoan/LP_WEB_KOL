'use client'

import React from 'react'
import DateRangeFilter from '@/components/filters/DateRangeFilter'
import KolOverviewMetrics from './components/KolOverviewMetrics'
import KolGrowthChart from './components/KolGrowthChart'
import TopKolsTable from './components/TopKolsTable'
import KolTierDistribution from './components/KolTierDistribution'
import KolTierCommission from './components/KolTierCommission'
import { useKolAnalyticsDateRangeUrlState } from './hooks/useKolAnalyticsDateRangeUrlState'

export default function AdminKolAnalyticsScreen() {
  const { dateRange, setDateRange } = useKolAnalyticsDateRangeUrlState()

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden animate-fade-in">
      {/* Header and Filter */}
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <section className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Phân tích KOL</h1>
          <p className="text-sm text-muted-foreground">
            Số liệu KOL, thành viên, hoa hồng và tốc độ phát triển theo khung thời gian.
          </p>
        </section>

        <DateRangeFilter
          from={dateRange.from}
          to={dateRange.to}
          isGetAllTime={dateRange.isGetAllTime}
          onChange={setDateRange}
        />
      </div>

      {/* Row 1: Overview Cards */}
      <KolOverviewMetrics dateRange={dateRange} />

      {/* Row 2: Charts and Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-7 h-full">
          <KolGrowthChart dateRange={dateRange} />
        </div>
        <div className="xl:col-span-5 h-full">
          <TopKolsTable dateRange={dateRange} />
        </div>
      </div>

      {/* Row 3: Structure and Commission Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-stretch">
        <div className="h-full">
          <KolTierDistribution />
        </div>
        <div className="h-full">
          <KolTierCommission />
        </div>
      </div>
    </div>
  )
}
