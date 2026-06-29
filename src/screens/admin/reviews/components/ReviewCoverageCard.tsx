import React from 'react'
import { hourlyTimelineData } from '../constants'

interface ReviewCoverageCardProps {
  mode: 1 | 2
}

interface MetricCardProps {
  label: string
  value: string | number
  className?: string
}

function MetricCard({ label, value, className = '' }: MetricCardProps) {
  return (
    <div className={`bg-[#282828]/50 rounded-lg p-4 md:p-6 flex justify-between items-center relative overflow-hidden ${className}`}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[30px] bg-[#F7F0A1] rounded-r" />
      <span className="text-sm font-semibold text-[#A8A8A9] uppercase">{label}</span>
      <span className="text-2xl md:text-[32px] font-bold text-white leading-9 md:leading-[48px]">{value}</span>
    </div>
  )
}

const statusColors = {
  idle: 'bg-[#282828]',
  loophole: 'bg-[#AA3028]',
  covered: 'bg-[#0D824B]',
}

export default function ReviewCoverageCard({ mode }: ReviewCoverageCardProps) {
  return (
    <div className="bg-surface-card rounded-2xl p-4 md:p-6 space-y-6 border border-border flex flex-col justify-between h-full">
      <h3 className="text-sm md:text-base font-semibold text-white">Coverage - có lỗ hổng xử lý tin không?</h3>

      {/* Mode 1: 3 items horizontally */}
      {mode === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MetricCard label="TIN API VỀ" value="142" />
          <MetricCard label="XỬ LÝ <15’" value="96%" />
          <MetricCard label="LỖ HỔNG (>30’ KHÔNG AI XỬ LÝ)" value="2" />
        </div>
      )}

      {/* Mode 2: 2x2 grid */}
      {mode === 2 && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <MetricCard label="TIN API VỀ" value="142" className="flex-1" />
            <MetricCard label="XỬ LÝ <15’" value="96%" className="flex-1" />
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <MetricCard label="LỖ HỔNG (>30’ KHÔNG AI XỬ LÝ)" value="2" className="flex-1" />
            <MetricCard label="CA TRỰC GHI NHẬN" value="3" className="flex-1" />
          </div>
        </div>
      )}

      {/* 24h Hourly Activity Timeline */}
      <div className="w-full p-4 border border-[#545454] rounded-lg flex flex-col gap-2">
        <div className="flex items-center gap-[3px] md:gap-1 w-full">
          {hourlyTimelineData.map((slot) => (
            <div
              key={slot.hour}
              className={`flex-1 h-7 rounded-sm transition-all duration-300 ${statusColors[slot.status]}`}
              title={`Hour ${slot.hour.toString().padStart(2, '0')}:00 - Status: ${slot.status}`}
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
