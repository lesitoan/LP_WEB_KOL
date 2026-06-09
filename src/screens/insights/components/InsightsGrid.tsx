import type { Insight } from '@/types/insights'

import InsightCard from './InsightCard'

type InsightsGridProps = {
  insights: Insight[]
}

export default function InsightsGrid({ insights }: InsightsGridProps) {
  if (!insights.length) {
    return (
      <div className="rounded-[14px] border border-[#202020] bg-[#0d0d0d] p-8 text-center text-[13.5px] font-medium text-[#9c9c9c]">
        Chưa có insight cho danh mục này.
      </div>
    )
  }

  return (
    <section className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </section>
  )
}
