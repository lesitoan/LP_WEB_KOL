"use client";

import React, { useState } from 'react'
import DateRangeFilter from '@/components/filters/DateRangeFilter'
import ReviewCoverageCard from './components/ReviewCoverageCard'
import AdminPerformanceTable from './components/AdminPerformanceTable'

export default function AdminReviewsScreen() {
  const [mode, setMode] = useState<1 | 2>(1)
  const [dateRange, setDateRange] = useState({
    from: '2026-03-05',
    to: '2026-03-06',
    isGetAllTime: false,
  })

  const handleToggleMode = () => {
    setMode((prev) => (prev === 1 ? 2 : 1))
  }

  const handleDateChange = (newRange: { from?: string; to?: string; isGetAllTime?: boolean }) => {
    setDateRange({
      from: newRange.from || '',
      to: newRange.to || '',
      isGetAllTime: !!newRange.isGetAllTime,
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-end items-start gap-6">
          <div className="flex flex-col items-start justify-start">
            <h1 className="text-2xl font-medium text-white leading-[31.2px]">
              Giám sát admin duyệt bài
            </h1>
            <p className="text-sm text-[#828283] font-normal leading-[21px] mt-1">
              Quy theo hành động thực tế trên từng bài — ai duyệt bài nào tính cho người đó
            </p>
          </div>
        </div>

        {/* Date Filter & Toggle Switch */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-2">
          <div className="self-end lg:self-auto">
            <DateRangeFilter
              from={dateRange.from}
              to={dateRange.to}
              isGetAllTime={dateRange.isGetAllTime}
              onChange={handleDateChange}
            />
          </div>

          {/* Premium Mode Toggle */}
          <button
            type="button"
            onClick={handleToggleMode}
            className="flex items-center gap-4 cursor-pointer select-none bg-transparent border-none text-left self-end lg:self-auto"
          >
            <span className="text-sm md:text-[18px] font-medium text-white text-right leading-[30px] transition-colors whitespace-nowrap">
              {mode === 1 ? 'Chế độ Cấp 1 - Tự suy từ hành động' : 'Chế độ cấp 2 - Check in ca trực'}
            </span>
            <div className={`w-[39px] h-6 rounded-full relative transition-colors duration-300 shrink-0 ${
              mode === 2 ? 'bg-[#12B76A]' : 'bg-[#828283]'
            }`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-md transition-all duration-300 ${
                mode === 2 ? 'left-[17px]' : 'left-0.5'
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* Stack of Components */}
      <div className="flex flex-col gap-6">
        <ReviewCoverageCard mode={mode} />
        <AdminPerformanceTable />
      </div>
    </div>
  )
}
