'use client'

import React, { useState } from 'react'
import DateRangeFilter from '@/components/filters/DateRangeFilter'
import ContentOverviewMetrics from './components/ContentOverviewMetrics'
import ForwardsByContent from './components/ForwardsByContent'
import ForwardRateByContent from './components/ForwardRateByContent'
import ContentStrategySuggestions from './components/ContentStrategySuggestions'

export default function AdminContentAnalyticsScreen() {
  const [dateRange, setDateRange] = useState({
    from: '2026-03-05',
    to: '2026-03-06',
    isGetAllTime: false,
  })

  const handleDateChange = (range: { from?: string; to?: string; isGetAllTime?: boolean }) => {
    setDateRange({
      from: range.from ?? '',
      to: range.to ?? '',
      isGetAllTime: range.isGetAllTime ?? false,
    })
  }

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden animate-fade-in">
      {/* Header and Filter */}
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <section className="min-w-0 space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-white">Phân tích nội dung</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Loại nội dung nào được KOL forward nhiều nhất — để định hướng sản xuất nội dung hiệu quả hơn.
          </p>
        </section>

        <DateRangeFilter
          from={dateRange.from}
          to={dateRange.to}
          isGetAllTime={dateRange.isGetAllTime}
          onChange={handleDateChange}
        />
      </div>

      {/* Row 1: Overview Cards */}
      <ContentOverviewMetrics />

      {/* Row 2: Forwards count and rate lists */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-stretch">
        <div className="h-full">
          <ForwardsByContent />
        </div>
        <div className="h-full">
          <ForwardRateByContent />
        </div>
      </div>

      {/* Row 3: Strategy suggestions */}
      <ContentStrategySuggestions />
    </div>
  )
}
