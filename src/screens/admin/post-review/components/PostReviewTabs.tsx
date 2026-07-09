import { ChevronLeft, ChevronRight } from 'lucide-react'
import { POST_REVIEW_TABS, type PostReviewTab } from '../constants'
import { useHorizontalScrollControls } from '../hooks/useHorizontalScrollControls'
import { cn } from '@/lib/utils'

interface PostReviewTabsProps {
  activeTab: PostReviewTab
  statusCounts: Record<PostReviewTab, number>
  onTabChange: (tab: PostReviewTab) => void
}

export default function PostReviewTabs({ activeTab, statusCounts, onTabChange }: PostReviewTabsProps) {
  const tabsScroll = useHorizontalScrollControls([activeTab, statusCounts])

  return (
    <div className="flex min-w-0 max-w-full flex-1 items-center gap-2 mr-auto">
      <button
        type="button"
        disabled={!tabsScroll.arrows.left}
        onClick={tabsScroll.scrollLeft}
        className={cn(
          "hidden h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/20 bg-transparent text-white transition-all hover:bg-white/5 active:scale-95 md:inline-flex",
          !tabsScroll.arrows.left && "opacity-30 cursor-not-allowed hover:bg-transparent active:scale-100"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={tabsScroll.scrollRef}
        onScroll={tabsScroll.updateArrows}
        className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {POST_REVIEW_TABS.map((tab) => {
          const count = statusCounts[tab.id] ?? 0
          const isActive = activeTab === tab.id
          const isDisabled = tab.id !== 'ALL' && count === 0

          return (
            <button
              key={tab.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-base font-medium leading-6 transition-all duration-200 flex items-center gap-2",
                isActive
                  ? "bg-[#282828] text-white shadow-[0_1px_3px_rgba(16,24,40,0.03),0_1px_4px_rgba(16,24,40,0.06)]"
                  : "text-[#A8A8A9] hover:text-white",
                isDisabled && "cursor-not-allowed opacity-40 hover:text-[#A8A8A9]"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full shrink-0 leading-[18px] font-normal",
                  isActive ? "bg-[#F7F0A1] text-black" : "bg-[#282828] text-[#A8A8A9]"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled={!tabsScroll.arrows.right}
        onClick={tabsScroll.scrollRight}
        className={cn(
          "hidden h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/20 bg-transparent text-white transition-all hover:bg-white/5 active:scale-95 md:inline-flex",
          !tabsScroll.arrows.right && "opacity-30 cursor-not-allowed hover:bg-transparent active:scale-100"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
