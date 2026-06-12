'use client'

import { useMemo, useState } from 'react'

import { insights, insightTabs } from './constants'
import InsightsGrid from './components/InsightsGrid'
import InsightsTabs from './components/InsightsTabs'
import type { InsightCategory } from '@/types/insights'

export default function InsightsScreen() {
  const [activeTab, setActiveTab] = useState<InsightCategory>('market')

  const visibleInsights = useMemo(
    () => insights.filter((insight) => insight.category === activeTab),
    [activeTab],
  )

  return (
    <div className="mx-auto w-full max-w-[1180px] animate-fade-in">
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold leading-tight text-white">
          Insights
        </h1>
        <p className="text-sm font-medium leading-5 text-[#8f8f8f]">
          Baseline chất lượng cho mọi tier - context + risk, không phải khuyến nghị mua/bán
        </p>
      </header>
      <InsightsTabs
        tabs={insightTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <InsightsGrid insights={visibleInsights} />
    </div>
  )
}
