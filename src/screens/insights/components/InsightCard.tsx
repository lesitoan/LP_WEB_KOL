import { ShieldAlert } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import type { Insight } from '@/types/insights'

function buildCopyText(insight: Insight) {
  return `${insight.title}\n${insight.risk}\nDữ kiện: ${insight.dataPoint}\nBối cảnh: ${insight.context}`
}

type InsightCardProps = {
  insight: Insight
}

export default function InsightCard({ insight }: InsightCardProps) {
  const handleCopy = async () => {
    if (!navigator?.clipboard) return
    await navigator.clipboard.writeText(buildCopyText(insight))
  }

  return (
    <article className="group relative h-full p-[1px] rounded-card bg-gradient-to-br from-white/60 via-transparent to-white/60 transition-all duration-300 hover:from-white hover:via-transparent hover:to-white shadow-[0_18px_42px_rgba(0,0,0,0.28)]">
      <div className="relative h-full overflow-hidden rounded-[13px] bg-surface-card px-5 py-5 flex flex-col justify-between gap-4">
        <div className="absolute left-0 top-6 h-7 w-[3px] rounded-r-full bg-brand" />

        <div className="space-y-4">
          <div className="space-y-3">
            <h2 className="text-lg font-bold leading-6 text-white">
              {insight.title}
            </h2>

            <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#4D2C03] px-2.5 py-1 text-[14px] font-normal leading-none text-[#FAB55A]">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0 fill-[#FAB55A]/15 text-[#FAB55A]" strokeWidth={1.8} />
              <span className="truncate">{insight.risk}</span>
            </div>
          </div>

          <div className="h-px bg-border-strong" />

          <div className="space-y-2 text-sm font-normal leading-5 text-muted-foreground">
            <p>
              Dữ kiện:{' '}
              <span className="font-medium text-foreground">{insight.dataPoint}</span>
            </p>
            <p>
              Bối cảnh:{' '}
              <span className="font-medium text-foreground">{insight.context}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            type="button"
            onClick={handleCopy}
            className="h-9 rounded-md bg-brand px-4 text-[14px] font-semibold text-primary-foreground hover:bg-brand-dim"
          >
            <Image
              src="/images/icons/copy_icon.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 shrink-0"
            />
            Sao chép & biên tập
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-9 rounded-md bg-white px-4 text-[14px] font-semibold text-zinc-900 hover:bg-zinc-200"
          >
            <Image
              src="/images/icons/send_icon.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 shrink-0"
            />
            Chuyển tiếp
          </Button>
        </div>
      </div>
    </article>
  )
}
