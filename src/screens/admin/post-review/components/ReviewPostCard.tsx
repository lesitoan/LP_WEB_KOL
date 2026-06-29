"use client"

import React from 'react'
import { CATEGORIES, type ReviewPost } from '../constants'
import { cn } from '@/lib/utils'

interface ReviewPostCardProps {
  post: ReviewPost
  isSelected: boolean
  onClick: () => void
}

export default function ReviewPostCard({ post, isSelected, onClick }: ReviewPostCardProps) {
  const catConfig = CATEGORIES[post.category]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-2xl bg-[#171717] relative flex flex-col gap-3 transition-all duration-200 outline outline-1",
        isSelected
          ? "outline-[#FFF9B3] shadow-lg shadow-black/40"
          : "outline-[#282828] hover:outline-[#545454]"
      )}
    >
      {/* Yellow vertical indicator strip */}
      <div className="absolute left-0 top-3 w-[3px] h-[30px] bg-[#F7F0A1] rounded-r" />

      {/* Row 1: Category Badge & Time/Indicator */}
      <div className="flex justify-between items-center w-full">
        {/* Category Badge */}
        <div className={cn("px-2 py-0.5 rounded-full flex items-center gap-1", catConfig.bgClass)}>
          {/* Dot/icon */}
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: catConfig.iconColor }}
          />
          <span className={cn("text-[12px] font-normal leading-normal", catConfig.textClass)}>
            {catConfig.label}
          </span>
        </div>

        {/* Time and Indicator */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-normal text-[#D7D8D9]">{post.time}</span>
          {/* Indicator circle */}
          <div className="w-5 h-5 rounded-full bg-[#D4A74A] flex items-center justify-center p-0.5 shrink-0">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
              <path d="M4 10.5l4.5 4.5 7.5-9" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-[#282828] w-full" />

      {/* Title Snippet */}
      <p className="text-sm font-medium text-white leading-[21px] line-clamp-3">
        {post.title}
      </p>

      {/* Row 3: Status Badges */}
      <div className="flex flex-wrap gap-1.5 items-center mt-1">
        {/* Main Status */}
        {post.status === 'pending' ? (
          <div className="px-2 py-0.5 rounded-full bg-[#4D2C03] text-[#FAB55A] flex items-center gap-1">
            <svg className="animate-pulse" width="10" height="10" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#FAB55A" strokeWidth="2.5"/>
            </svg>
            <span className="text-[12px] font-normal">Chờ duyệt</span>
          </div>
        ) : post.subStatus === 'published' ? (
          <div className="px-2 py-0.5 rounded-full bg-[#06301C] text-[#60CF9B] flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
              <path d="M4 10.5l4.5 4.5 7.5-9" stroke="#60CF9B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[12px] font-normal">Đã đăng</span>
          </div>
        ) : (
          <div className="px-2 py-0.5 rounded-full bg-[#002D67] text-[#549BF8] flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#549BF8" strokeWidth="2.5" strokeDasharray="4 2"/>
            </svg>
            <span className="text-[12px] font-normal">Đã lên lịch</span>
          </div>
        )}

        {/* Sub Status (e.g. T2 yêu cầu xử lý) */}
        {post.subStatus === 't2_required' && (
          <div className="px-2 py-0.5 rounded-full bg-[#4D2C03] text-[#FAB55A] flex items-center gap-1">
            <span className="text-[12px] font-normal">T2 yêu cầu xử lý</span>
          </div>
        )}
      </div>
    </button>
  )
}
