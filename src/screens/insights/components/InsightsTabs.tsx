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
  return (
    <div className="mb-7 overflow-x-auto data-table-scroll-viewport">
      <div className="flex min-w-max items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'h-10 rounded-full px-4 text-[13.5px] font-semibold transition-colors',
              activeTab === tab.id
                ? 'bg-[#2b2b2b] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                : 'text-[#8f8f8f] hover:bg-[#151515] hover:text-white',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
