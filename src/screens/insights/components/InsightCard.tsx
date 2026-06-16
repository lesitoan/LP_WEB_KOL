import { Copy, Send, ShieldAlert } from 'lucide-react'

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
    <article className="group relative h-full p-[1px] rounded-[14px] bg-gradient-to-br from-white/60 via-transparent to-white/60 transition-all duration-300 hover:from-white hover:via-transparent hover:to-white shadow-[0_18px_42px_rgba(0,0,0,0.28)]">
      <div className="relative h-full overflow-hidden rounded-[13px] bg-[#0d0d0d] px-5 py-5 flex flex-col justify-between gap-4">
        <div className="absolute left-0 top-6 h-7 w-[3px] rounded-r-full bg-[#ffcf12]" />

        <div className="space-y-4">
          <div className="space-y-3">
            <h2 className="text-lg font-bold leading-6 text-white">
              {insight.title}
            </h2>

            <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#8b5406]/80 px-2.5 py-1 text-[12px] font-semibold leading-none text-[#ffc76c]">
              <ShieldAlert className="text-sm font-normal h-3.5 w-3.5 shrink-0 fill-[#ffc76c]/15" strokeWidth={1.8} />
              <span className="truncate">{insight.risk}</span>
            </div>
          </div>

          <div className="h-px bg-[#2c2c2c]" />

          <div className="space-y-2 text-sm font-normal leading-5 text-[#9c9c9c]">
            <p>
              Dữ kiện:{' '}
              <span className="font-medium text-[#e8e8e8]">{insight.dataPoint}</span>
            </p>
            <p>
              Bối cảnh:{' '}
              <span className="font-medium text-[#e8e8e8]">{insight.context}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            type="button"
            onClick={handleCopy}
            className="h-9 rounded-md bg-brand px-4 text-sm font-medium text-primary-foreground hover:bg-brand-dim"
          >
            <Copy className="h-4 w-4" strokeWidth={1.8} />
            Copy & biên tập
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-9 rounded-md bg-white px-4 text-[13px] font-medium text-[#242424] hover:bg-[#e8e8e8]"
          >
            <Send className="h-4 w-4" strokeWidth={1.8} />
            Forward
          </Button>
        </div>
      </div>
    </article>
  )
}
