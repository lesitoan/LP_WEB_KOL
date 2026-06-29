import React from 'react'
import { overviewMetrics } from '../constants'

const iconsMap: Record<string, string> = {
  'TIN ĐÃ ĐĂNG': '/images/admin/analytics-content/post-count.svg',
  'LƯỢT KOL ĐĂNG': '/images/admin/analytics-content/kol-post-count.svg',
  'TỶ LỆ SỬ DỤNG TIN': '/images/admin/analytics-content/post-usage-rate.svg',
  'LOẠI TIN HIỆU QUẢ NHẤT': '/images/admin/analytics-content/top-performing-post-type.svg',
}

export default function ContentOverviewMetrics() {
  return (
    <div className="bg-surface-card rounded-2xl p-4 md:p-6 space-y-4 border border-border">
      <h3 className="text-sm md:text-base font-semibold text-white">Chỉ số tổng quan</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        {overviewMetrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-[#282828]/50 rounded-lg p-4 md:p-6 flex flex-col justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              {iconsMap[metric.label] ? (
                <img src={iconsMap[metric.label]} alt={metric.label} className="w-8 h-8 shrink-0" />
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
              <div className="flex items-center gap-1 text-xs md:text-sm">
                {metric.isSuccessChange ? (
                  <>
                    <svg className="w-3.5 h-3.5 fill-[#12B76A] shrink-0" viewBox="0 0 24 24">
                      <path d="M12 6l9 12H3l9-12z" />
                    </svg>
                    <span className="font-normal text-[#12B76A]">{metric.change}</span>
                  </>
                ) : (
                  <span className="font-normal text-[#A8A8A9]">{metric.change}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
