import { Inbox } from 'lucide-react'
import { InsightCardSkeleton } from '@/components/skeletons/InsightCardSkeleton'
import type { InsightListItem } from '@/types/insights'

import InsightCard from './InsightCard'

type InsightsGridProps = {
  insights: InsightListItem[]
  isLoading?: boolean
  onViewInsight: (insight: InsightListItem) => void
  onEditInsight: (insight: InsightListItem) => void
  onPublishInsight: (insight: InsightListItem) => void
}

export default function InsightsGrid({
  insights,
  isLoading = false,
  onViewInsight,
  onEditInsight,
  onPublishInsight,
}: InsightsGridProps) {
  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <InsightCardSkeleton key={index} />
        ))}
      </section>
    )
  }

  if (!insights.length) {
    return (
      <div className="grid min-h-[520px] place-items-center border-0 bg-transparent px-4 py-16 text-center shadow-none outline-none">
        <div className="flex max-w-[360px] flex-col items-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#A8A8A9] text-black">
            <Inbox className="h-8 w-8" strokeWidth={2.4} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold leading-8 text-white">Không có dữ liệu</h2>
          <p className="mt-3 text-sm leading-5 text-[#707070]">
            Hiện chưa có insight nào phù hợp với bộ lọc này
            <br />
            Vui lòng thử chọn loại nội dung khác
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onView={onViewInsight}
          onEdit={onEditInsight}
          onPublish={onPublishInsight}
        />
      ))}
    </section>
  )
}
