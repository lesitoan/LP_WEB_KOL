'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { InsightTab, InsightTabId } from '@/types/insights'

type InsightsTabsProps = {
  tabs: InsightTab[]
  activeTab: InsightTabId
  onTabChange: (tab: InsightTabId) => void
}

export default function InsightsTabs({
  tabs,
  activeTab,
  onTabChange,
}: InsightsTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState({ left: false, right: false })

  const updateScrollState = () => {
    const node = scrollRef.current
    if (!node) return
    const { scrollLeft, scrollWidth, clientWidth } = node
    setScrollState({
      left: scrollLeft > 1,
      right: scrollLeft < scrollWidth - clientWidth - 1,
    })
  }

  const scrollTabs = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -220 : 220,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    updateScrollState()
    const node = scrollRef.current
    if (!node) return

    const observer = new ResizeObserver(updateScrollState)
    observer.observe(node)
    return () => observer.disconnect()
  }, [tabs])

  const showArrows = scrollState.left || scrollState.right

  return (
    <div className="mb-4 flex items-center gap-2">
      {showArrows && (
        <button
          type="button"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#222222] text-white transition-colors hover:bg-[#2E2E2E] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-[#222222]"
          onClick={() => scrollTabs('left')}
          disabled={!scrollState.left}
          aria-label="Cuộn tab sang trái"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="scrollbar-none min-w-0 flex-1 overflow-x-auto scroll-smooth"
        onScroll={updateScrollState}
      >
        <div className="flex min-w-max items-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const count = tab.count ?? 0
            const isDisabled = count === 0

            return (
              <button
                key={tab.id}
                type="button"
                disabled={isDisabled}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'inline-flex h-8 items-center gap-2 rounded-full px-3 text-[13px] font-semibold transition-colors',
                  isActive
                    ? 'bg-[#242516] text-[#F7F0A1]'
                    : 'bg-[#1F1F1F] text-[#A8A8A9] hover:bg-[#292929] hover:text-white',
                  isDisabled && 'cursor-not-allowed opacity-40 hover:bg-[#1F1F1F] hover:text-[#A8A8A9]',
                )}
              >
                <span className="max-w-[180px] truncate">{tab.label}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] leading-none',
                    isActive ? 'bg-[#F7F0A1]/20 text-[#F7F0A1]' : 'bg-[#353535] text-[#A8A8A9]',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {showArrows && (
        <button
          type="button"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#222222] text-white transition-colors hover:bg-[#2E2E2E] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-[#222222]"
          onClick={() => scrollTabs('right')}
          disabled={!scrollState.right}
          aria-label="Cuộn tab sang phải"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
        </button>
      )}
    </div>
  )
}
