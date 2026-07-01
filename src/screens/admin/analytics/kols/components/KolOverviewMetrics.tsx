import React from 'react'
import {
  type KolAnalyticsDateRange,
} from '../hooks/useKolGrowthChartData'
import { useKolOverviewMetricsData } from '../hooks/useKolOverviewMetricsData'
import { KolOverviewMetricsSkeleton } from '@/components/skeletons/admin/KolAnalyticsSkeletons'

const metricIconSrcs = [
  '/images/admin/analytics-kol/total-kol-icon.svg',
  '/images/admin/analytics-kol/member-count-icon.svg',
  '/images/admin/analytics-kol/commission-icon.svg',
  '/images/admin/analytics-kol/kol-growth-icon.svg',
]

interface KolOverviewMetricsProps {
  dateRange: KolAnalyticsDateRange
}

export default function KolOverviewMetrics({ dateRange }: KolOverviewMetricsProps) {
  const { metrics, query } = useKolOverviewMetricsData(dateRange)

  if (query.isLoading || query.isFetching) {
    return <KolOverviewMetricsSkeleton />
  }

  return (
    <div className="bg-surface-card rounded-2xl p-4 md:p-6 space-y-4 border border-border">
      <h3 className="text-sm md:text-base font-semibold text-white">Chỉ số tổng quan</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="bg-[#282828]/50 rounded-lg p-4 md:p-6 flex flex-col justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              {metricIconSrcs[index] ? (
                <img src={metricIconSrcs[index]} alt={metric.label} className="w-8 h-8 shrink-0" />
              ) : (
                <div className="w-8 h-8 bg-muted shrink-0" />
              )}
              <span className="text-sm font-semibold text-[#A8A8A9]">
                {metric.label}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-2xl font-bold text-white leading-9 md:text-[32px] md:leading-[48px] tracking-tight">
                {metric.value}
              </h4>
              <div className={`flex items-center gap-1 text-sm ${metric.isPositive ? 'text-[#12B76A]' : 'text-red-400'}`}>
                <svg className={`w-3.5 h-3.5 shrink-0 ${metric.isPositive ? 'fill-[#12B76A]' : 'fill-red-400 rotate-180'}`} viewBox="0 0 24 24">
                  <path d="M12 6l9 12H3l9-12z" />
                </svg>
                <span className="font-normal">{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
