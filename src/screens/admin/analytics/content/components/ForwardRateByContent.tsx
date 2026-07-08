import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ForwardsByContentSkeleton } from '@/components/skeletons/admin/analytics/ContentAnalyticsSkeletons'
import { cn } from '@/lib/utils'
import type { ContentAnalyticsDateRange } from '../hooks/useContentOverviewMetricsData'
import { useForwardRateByContentData } from '../hooks/useForwardRateByContentData'

const colorMap = {
  green: 'bg-[#12B76A]',
  gold: 'bg-[#D4A74A]',
  orange: 'bg-[#E18308]',
}

interface ForwardRateByContentProps {
  dateRange: ContentAnalyticsDateRange
}

export default function ForwardRateByContent({ dateRange }: ForwardRateByContentProps) {
  const { items, query, showEmpty } = useForwardRateByContentData(dateRange)
  const listRef = React.useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = React.useState({ canScrollUp: false, canScrollDown: true })

  const updateScrollState = React.useCallback(() => {
    const list = listRef.current
    if (!list) return

    setScrollState({
      canScrollUp: list.scrollTop > 1,
      canScrollDown: list.scrollHeight > list.clientHeight + 1 && list.scrollTop + list.clientHeight < list.scrollHeight - 1,
    })
  }, [])

  React.useEffect(() => {
    const list = listRef.current
    if (!list) return

    const animationFrameId = window.requestAnimationFrame(updateScrollState)
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateScrollState)
      : null

    resizeObserver?.observe(list)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      resizeObserver?.disconnect()
    }
  }, [items.length, updateScrollState])

  const scrollList = (direction: 'up' | 'down') => {
    const list = listRef.current
    if (!list) return

    list.scrollBy({
      top: direction === 'up' ? -list.clientHeight * 0.8 : list.clientHeight * 0.8,
      behavior: 'smooth',
    })
  }

  if (query.isLoading || query.isFetching) {
    return <ForwardsByContentSkeleton />
  }

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="order-2 flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => scrollList('up')}
            disabled={!scrollState.canScrollUp}
            className={cn(
              'grid h-6 w-6 place-items-center rounded-md border border-[#F7F0A1]/25 bg-transparent text-[#F7F0A1] transition-[border-color,opacity,transform,background-color] duration-150 hover:border-[#F7F0A1]/70 hover:bg-[#F7F0A1]/5 active:scale-90',
              !scrollState.canScrollUp && 'cursor-not-allowed opacity-35 hover:border-[#F7F0A1]/25 hover:bg-transparent'
            )}
            aria-label="Cuộn lên"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollList('down')}
            disabled={!scrollState.canScrollDown}
            className={cn(
              'grid h-6 w-6 place-items-center rounded-md border border-[#F7F0A1]/25 bg-transparent text-[#F7F0A1] transition-[border-color,opacity,transform,background-color] duration-150 hover:border-[#F7F0A1]/70 hover:bg-[#F7F0A1]/5 active:scale-90',
              !scrollState.canScrollDown && 'cursor-not-allowed opacity-35 hover:border-[#F7F0A1]/25 hover:bg-transparent'
            )}
            aria-label="Cuộn xuống"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      <div className="order-1 min-w-0 flex-1 space-y-1">
        <h4 className="text-sm md:text-base font-semibold text-white">Tỷ lệ forward / lượt nhận</h4>
        <p className="text-xs md:text-sm text-[#A8A8A9]">Hiệu quả tương đối — quan trọng hơn số tuyệt đối</p>
      </div>
      </div>

      {showEmpty ? (
        <div className="flex min-h-[240px] flex-1 items-center justify-center text-sm font-medium text-muted-foreground">
          Không có dữ liệu
        </div>
      ) : (
        <div
          ref={listRef}
          onScroll={updateScrollState}
          className="flex max-h-[360px] flex-1 flex-col gap-3 overflow-y-auto pr-1 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <React.Fragment key={item.title}>
              {index > 0 && <div className="w-full h-px bg-surface-control" />}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="min-w-0 truncate text-sm md:text-base font-semibold text-white">{item.title}</span>
                  <span className="shrink-0 text-sm md:text-base font-normal text-white">{item.rateText}</span>
                </div>

                <div className="w-full h-2 bg-[#282828] rounded-full overflow-hidden relative">
                  <div
                    className={`h-full ${colorMap[item.color]} rounded-full transition-all duration-500`}
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
