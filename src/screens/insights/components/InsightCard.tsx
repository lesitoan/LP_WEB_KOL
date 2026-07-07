import { Flame } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { InsightBadge, InsightListItem } from '@/types/insights'

const ACTION_BUTTON_CLASS =
  'h-[clamp(1.75rem,2.6vw,2.25rem)] shrink-0 gap-[clamp(0.25rem,0.55vw,0.5rem)] rounded-lg px-[clamp(0.5rem,1vw,1rem)] text-[clamp(0.625rem,0.9vw,0.875rem)] font-semibold whitespace-nowrap'
const ACTION_ICON_CLASS = 'h-[clamp(0.75rem,1.4vw,1.25rem)] w-[clamp(0.75rem,1.4vw,1.25rem)] shrink-0'

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

  return <span className="h-2 w-2 rounded-full bg-current" />
}

function getInsightThumbnail(insight: InsightListItem) {
  const imageUrls = insight.source.imageUrls
  if (!Array.isArray(imageUrls)) return null

  const firstUrl = imageUrls.find((url): url is string => typeof url === 'string' && Boolean(url.trim()))
  return firstUrl ?? null
}

export default function InsightCard({ insight, onView, onEdit, onPublish }: InsightCardProps) {
  const isPublished = insight.source.delivery?.status === 'PUBLISHED'
  const thumbnailUrl = getInsightThumbnail(insight)

  return (
    <article className="group relative rounded-2xl bg-gradient-to-br from-white/60 via-transparent to-white/60 p-[1px] shadow-[0_18px_42px_rgba(0,0,0,0.28)] transition-all duration-300 hover:from-white hover:via-transparent hover:to-white">
      <div className="relative overflow-hidden rounded-[15px] bg-[#171717] p-6">
        <div className="absolute left-0 top-6 h-[30px] w-[3px] rounded-r-[10px] bg-[#F7F0A1]" />

        <div
          className={cn(
            'grid grid-cols-1 items-start gap-6 lg:items-stretch',
            thumbnailUrl && 'lg:grid-cols-2'
          )}
        >
          {thumbnailUrl ? (
            <div className="relative aspect-video min-w-0 overflow-hidden rounded-2xl bg-[#0D0D0D] lg:aspect-auto lg:min-h-full">
              <img
                src={thumbnailUrl}
                alt=""
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
          ) : null}

          <div className="flex min-w-0 flex-col items-end gap-4 self-stretch">
            <div className="flex w-full flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {insight.badges.map((badge) => (
                  <span
                    key={`${insight.id}-${badge.label}`}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full font-normal',
                      badge.tone === 'danger' &&
                        'bg-[#5C120C] py-0.5 pl-1.5 pr-2 text-xs leading-[18px] text-[#F5827A]',
                      badge.tone === 'success' &&
                        'bg-[#06301C] py-0.5 pl-2 pr-2.5 text-sm leading-[21px] text-[#60CF9B]',
                      badge.tone === 'neutral' &&
                        'bg-[#282828] py-0.5 px-2.5 text-sm leading-[21px] text-[#A8A8A9]',
                    )}
                  >
                    <BadgeIcon badge={badge} />
                    {badge.label}
                  </span>
                ))}
              </div>

              <h2 className="break-words text-base font-bold leading-6 text-white">
                {insight.headline}
              </h2>
            </div>

            <div className="w-full border-t border-[#545454] py-4">
              <p className="line-clamp-4 text-sm font-normal leading-[21px] text-white">
                {insight.excerpt}
              </p>
            </div>

            <div className="mt-auto flex w-full flex-nowrap items-center justify-end gap-[clamp(0.375rem,0.9vw,1rem)]">
              <Button
                type="button"
                onClick={() => onEdit(insight)}
                disabled={isPublished}
                className={cn(
                  ACTION_BUTTON_CLASS,
                  isPublished
                    ? 'bg-[#FDFDFD]/30 text-black/40 !pointer-events-auto !cursor-not-allowed opacity-50'
                    : 'bg-[#FDFDFD] text-black hover:bg-zinc-200',
                )}
              >
                <img src="/images/insights/edit-icon.svg" alt="" className={ACTION_ICON_CLASS} />
                Chỉnh sửa
              </Button>
              <Button
                type="button"
                onClick={() => onPublish(insight)}
                disabled={isPublished}
                className={cn(
                  ACTION_BUTTON_CLASS,
                  isPublished
                    ? 'bg-[#FDFDFD]/30 text-black/40 !pointer-events-auto !cursor-not-allowed opacity-50'
                    : 'bg-[#FDFDFD] text-black hover:bg-zinc-200',
                )}
              >
                <img src="/images/insights/publish-icon.svg" alt="" className={ACTION_ICON_CLASS} />
                {isPublished ? 'Đã đăng tin' : 'Đăng tin'}
              </Button>
              <Button
                type="button"
                onClick={() => onView(insight)}
                className={cn(ACTION_BUTTON_CLASS, 'bg-[#F7F0A1] text-black hover:bg-[#FFF7B8]')}
              >
                <img src="/images/insights/eye-icon.svg" alt="" className={ACTION_ICON_CLASS} />
                Xem chi tiết tin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
