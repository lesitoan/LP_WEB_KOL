import React from 'react'
import type { ReviewCoverageMetric, ReviewCoverageTimelineSlot } from '../hooks/useReviewCoverageData'

interface ReviewCoverageCardProps {
  mode: 1 | 2
  metrics: ReviewCoverageMetric[]
  timelineSlots: ReviewCoverageTimelineSlot[]
  isLoading?: boolean
}

interface MetricCardProps {
  label: string
  value: string | number
  className?: string
  isLoading?: boolean
}

function MetricCard({ label, value, className = '', isLoading = false }: MetricCardProps) {
  return (
    <div className={`bg-[#282828]/50 rounded-lg p-4 md:p-6 flex justify-between items-center relative overflow-hidden ${className}`}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[30px] bg-[#F7F0A1] rounded-r" />
      <span className="text-sm font-semibold text-[#A8A8A9] uppercase">{label}</span>
      <span className={`text-2xl md:text-[32px] font-bold text-white leading-9 md:leading-[48px] ${isLoading ? 'animate-pulse text-[#A8A8A9]' : ''}`}>
        {value}
      </span>
    </div>
  )
}

const statusColors = {
  empty: 'bg-[#282828]',
  planned: 'bg-[#282828]',
  uncovered: 'bg-[#AA3028]',
  covered: 'bg-[#0D824B]',
}

export default function ReviewCoverageCard({
  mode,
  metrics,
  timelineSlots,
  isLoading = false,
}: ReviewCoverageCardProps) {
  const metricByKey = new Map(metrics.map((item) => [item.key, item]))
  const visibleMetrics = mode === 1
    ? [
      metricByKey.get('apiReceived'),
      metricByKey.get('handledUnder15Rate'),
      metricByKey.get('missedOver30'),
    ].filter((item): item is ReviewCoverageMetric => Boolean(item))
    : [
      metricByKey.get('apiReceived'),
      metricByKey.get('missedOver30'),
      metricByKey.get('handledUnder15Rate'),
      metricByKey.get('shiftCheckIns'),
    ].filter((item): item is ReviewCoverageMetric => Boolean(item))

  return (
    <div className="bg-surface-card rounded-2xl p-4 md:p-6 space-y-6 border border-border flex flex-col justify-between h-full">
      <h3 className="text-sm md:text-base font-semibold text-white">Coverage - có lỗ hổng xử lý tin không?</h3>

      {mode === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {visibleMetrics.map((item) => (
            <MetricCard
              key={item.key}
              label={item.label}
              value={item.value}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {mode === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visibleMetrics.map((item) => (
            <MetricCard
              key={item.key}
              label={item.label}
              value={item.value}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      <div className="w-full p-4 border border-[#545454] rounded-lg flex flex-col gap-2">
        <div className="flex items-center gap-[3px] md:gap-1 w-full">
          {timelineSlots.map((slot) => (
            <div
              key={slot.key}
              className={`flex-1 h-7 rounded-sm transition-all duration-300 ${statusColors[slot.status]} ${isLoading ? 'animate-pulse' : ''}`}
              title={`${slot.label} - ${slot.status} (${slot.activeAdminCount} admin active)`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center px-1 text-xs text-[#A8A8A9] font-normal leading-5">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  )
}
