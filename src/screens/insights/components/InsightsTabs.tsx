'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { InsightCategory, InsightTab } from '@/types/insights'

type InsightsTabsProps = {
  tabs: InsightTab[]
  activeTab: InsightCategory
  onTabChange: (tab: InsightCategory) => void
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
      left: direction === 'left' ? -260 : 260,
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
    <div className="mb-7 flex items-center gap-2">
      {showArrows && (
        <button
          type="button"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-control text-white shadow-[0_0_18px_rgba(0,0,0,0.55)] transition-colors hover:bg-surface-control-hover disabled:cursor-default disabled:opacity-35 disabled:hover:bg-surface-control"
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'h-10 rounded-full px-4 text-base font-semibold transition-colors',
                activeTab === tab.id
                  ? 'bg-surface-control text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                  : 'text-muted-foreground hover:bg-surface-control-hover hover:text-white',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {showArrows && (
        <button
          type="button"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-control text-white shadow-[0_0_18px_rgba(0,0,0,0.55)] transition-colors hover:bg-surface-control-hover disabled:cursor-default disabled:opacity-35 disabled:hover:bg-surface-control"
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
