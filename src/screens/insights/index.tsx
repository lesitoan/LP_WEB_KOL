'use client'

import { useState } from 'react'

import type { PublishKolInsightTarget } from '@/types/api/kolInsight'
import type { InsightListItem, InsightModalMode } from '@/types/insights'
import InsightEditModal from './components/InsightEditModal'
import InsightsGrid from './components/InsightsGrid'
import InsightsHeader from './components/InsightsHeader'
import InsightsTabs from './components/InsightsTabs'
import PublishInsightModal from './components/PublishInsightModal'
import { useInsightActions } from './hooks/useInsightActions'
import { useInsightDetail } from './hooks/useInsightDetail'
import { useInsightsData } from './hooks/useInsightsData'
import { useInsightsUrlState } from './hooks/useInsightsUrlState'

export default function InsightsScreen() {
  const [detailMode, setDetailMode] = useState<InsightModalMode>('view')
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null)
  const [publishingInsight, setPublishingInsight] = useState<InsightListItem | null>(null)

  const urlState = useInsightsUrlState()
  const data = useInsightsData({ activeTab: urlState.activeTab })
  const detail = useInsightDetail(selectedInsightId)
  const actions = useInsightActions()

  const handleOpenDetail = (insight: InsightListItem, mode: InsightModalMode) => {
    setDetailMode(mode)
    setSelectedInsightId(insight.id)
  }

  const handleDetailModalOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedInsightId(null)
    }
  }

  const handlePublish = (insightId: string, targets: PublishKolInsightTarget[]) =>
    actions.handlePublish({ insightId, targets })

  return (
    <div className="w-full animate-fade-in">
      <InsightsHeader />
      <InsightsTabs
        tabs={data.tabs}
        activeTab={urlState.activeTab}
        onTabChange={urlState.setActiveTab}
      />
      <InsightsGrid
        insights={data.insights}
        isLoading={data.isLoading}
        onViewInsight={(insight) => handleOpenDetail(insight, 'view')}
        onEditInsight={(insight) => handleOpenDetail(insight, 'edit')}
        onPublishInsight={setPublishingInsight}
      />
      <InsightEditModal
        detail={detail.detail}
        mode={detailMode}
        open={Boolean(selectedInsightId)}
        isLoading={detail.isLoading}
        isSaving={actions.isSaving}
        onOpenChange={handleDetailModalOpenChange}
        onSave={actions.handleSaveCustomization}
      />
      <PublishInsightModal
        insight={publishingInsight}
        open={Boolean(publishingInsight)}
        isPublishing={actions.isPublishing}
        onOpenChange={(open) => {
          if (!open) {
            setPublishingInsight(null)
          }
        }}
        onPublish={handlePublish}
      />
    </div>
  )
}
