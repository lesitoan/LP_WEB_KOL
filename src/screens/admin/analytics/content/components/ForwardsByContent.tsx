import React from 'react'
import { ForwardsByContentSkeleton } from '@/components/skeletons/admin/analytics/ContentAnalyticsSkeletons'
import type { ContentAnalyticsDateRange } from '../hooks/useContentOverviewMetricsData'
import { useForwardsByContentData } from '../hooks/useForwardsByContentData'

interface ForwardsByContentProps {
  dateRange: ContentAnalyticsDateRange
}

export default function ForwardsByContent({ dateRange }: ForwardsByContentProps) {
  const { items, query, showEmpty } = useForwardsByContentData(dateRange)

  if (query.isLoading || query.isFetching) {
    return <ForwardsByContentSkeleton />
  }

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-1">
        <h4 className="text-sm md:text-base font-semibold text-white">Lượt forward theo nội dung</h4>
        <p className="text-xs md:text-sm text-[#A8A8A9]">Số tuyệt đối · sắp xếp giảm dần</p>
      </div>

      {showEmpty ? (
        <div className="flex min-h-[240px] flex-1 items-center justify-center text-sm font-medium text-muted-foreground">
          Không có dữ liệu
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 w-full pt-2">
          {items.map((item, index) => (
            <React.Fragment key={item.title}>
              {index > 0 && <div className="w-full h-px bg-surface-control" />}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="min-w-0 truncate text-sm md:text-base font-semibold text-white">{item.title}</span>
                  <span className="shrink-0 text-sm md:text-base font-normal text-white">{item.fwdText}</span>
                </div>

                <div className="w-full h-2 bg-[#282828] rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-[#D4A74A] rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
