'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function InsightCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#171717] p-6 animate-pulse flex flex-col gap-4">
      {/* Left accent bar skeleton */}
      <div className="absolute left-0 top-6 h-[30px] w-[3px] rounded-r-[10px] bg-[#F7F0A1]/20" />

      <div className="flex flex-col gap-4">
        {/* Top section: badges + headline */}
        <div className="flex flex-col gap-2.5">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full bg-[#282828]" />
            <Skeleton className="h-6 w-16 rounded-full bg-[#282828]" />
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full rounded bg-[#282828]" />
            <Skeleton className="h-5 w-[85%] rounded bg-[#282828]" />
          </div>
        </div>

        {/* Body */}
        <div className="border-t border-[#545454]/30 pt-4 space-y-2">
          <Skeleton className="h-4 w-full rounded bg-[#282828]/70" />
          <Skeleton className="h-4 w-full rounded bg-[#282828]/70" />
          <Skeleton className="h-4 w-[60%] rounded bg-[#282828]/70" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Skeleton className="h-9 w-[138px] rounded-lg bg-[#282828]" />
          <Skeleton className="h-9 w-[98px] rounded-lg bg-[#282828]" />
          <Skeleton className="h-9 w-[98px] rounded-lg bg-[#282828]" />
        </div>
      </div>
    </div>
  )
}
