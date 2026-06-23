import type { Insight } from '@/types/insights'

import InsightCard from './InsightCard'

type InsightsGridProps = {
  insights: Insight[]
}

export default function InsightsGrid({ insights }: InsightsGridProps) {
  if (!insights.length) {
    return (
      <div className="rounded-card border border-border-strong bg-surface-card p-8 text-center text-[13.5px] font-medium text-muted-foreground">
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
