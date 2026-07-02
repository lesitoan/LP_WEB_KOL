import { Flame } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { InsightBadge, InsightListItem } from '@/types/insights'

type InsightCardProps = {
  insight: InsightListItem
  onView: (insight: InsightListItem) => void
  onEdit: (insight: InsightListItem) => void
  onPublish: (insight: InsightListItem) => void
}

function BadgeIcon({ badge }: { badge: InsightBadge }) {
  if (badge.tone === 'danger') {
    return <Flame className="h-3 w-3 fill-[#F5827A]/30 text-[#F5827A]" strokeWidth={1.8} />
  }
  // success dot
  return <span className="h-2 w-2 rounded-full bg-current" />
}

export default function InsightCard({ insight, onView, onEdit, onPublish }: InsightCardProps) {
  const isPublished = insight.source.delivery?.status === 'PUBLISHED'

  return (
    <article className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-white/60 via-transparent to-white/60 transition-all duration-300 hover:from-white hover:via-transparent hover:to-white shadow-[0_18px_42px_rgba(0,0,0,0.28)]">
      <div className="relative overflow-hidden rounded-[15px] bg-[#171717] p-6 flex flex-col gap-4">
        {/* Left accent bar */}
        <div className="absolute left-0 top-6 h-[30px] w-[3px] rounded-r-[10px] bg-[#F7F0A1]" />

        {/* Top section: badges + headline */}
        <div className="flex flex-col gap-2">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            {insight.badges.map((badge) => (
              <span
                key={`${insight.id}-${badge.label}`}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full font-normal',
                  badge.tone === 'danger' && 'bg-[#5C120C] px-1 md:px-1.5 py-0.5 text-[11px] md:text-[12px] leading-[16px] md:leading-[18px] text-[#F5827A]',
                  badge.tone === 'success' && 'bg-[#06301C] px-2 md:px-2.5 py-0.5 text-[12px] md:text-[14px] leading-[18px] md:leading-[21px] text-[#60CF9B]',
                  badge.tone === 'neutral' && 'bg-[#282828] px-2 md:px-2.5 py-0.5 text-[12px] md:text-[14px] leading-[18px] md:leading-[21px] text-[#A8A8A9]',
                )}
              >
                <BadgeIcon badge={badge} />
                {badge.label}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h2 className="text-sm md:text-base font-bold leading-5 md:leading-6 text-white break-words">
            {insight.headline}
          </h2>
        </div>

        {/* Body */}
        <div className="border-t border-[#545454] pt-4">
          <p className="text-[13px] md:text-sm font-normal leading-[19px] md:leading-[21px] text-white">
            {insight.excerpt}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="button"
            onClick={() => onView(insight)}
            className="h-9 gap-2 rounded-lg bg-[#F7F0A1] px-4 text-[13px] md:text-sm font-semibold text-black hover:bg-[#FFF7B8]"
          >
            <img src="/images/insights/eye-icon.svg" alt="" className="h-5 w-5 shrink-0" />
            Xem chi tiết tin
          </Button>
          <Button
            type="button"
            onClick={() => onEdit(insight)}
            disabled={isPublished}
            className={cn(
              'h-9 gap-2 rounded-lg px-4 text-[13px] md:text-sm font-semibold',
              isPublished
                ? 'bg-[#FDFDFD]/30 text-black/40 !cursor-not-allowed !pointer-events-auto opacity-50'
                : 'bg-[#FDFDFD] text-black hover:bg-zinc-200',
            )}
          >
            <img src="/images/insights/edit-icon.svg" alt="" className="h-5 w-5 shrink-0" />
            Chỉnh sửa
          </Button>
          <Button
            type="button"
            onClick={() => onPublish(insight)}
            disabled={isPublished}
            className={cn(
              'h-9 gap-2 rounded-lg px-4 text-[13px] md:text-sm font-semibold',
              isPublished
                ? 'bg-[#FDFDFD]/30 text-black/40 !cursor-not-allowed !pointer-events-auto opacity-50'
                : 'bg-[#FDFDFD] text-black hover:bg-zinc-200',
            )}
          >
            <img src="/images/insights/publish-icon.svg" alt="" className="h-5 w-5 shrink-0" />
            {isPublished ? 'Đã đăng tin' : 'Đăng tin'}
          </Button>
        </div>
      </div>
    </article>
  )
}
