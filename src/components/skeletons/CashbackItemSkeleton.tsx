'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function CashbackItemSkeleton() {
  return (
    <div className="bg-surface-1 border border-border rounded-[14px] p-5 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24 opacity-60" />
        </div>
      </div>

      {/* Slider area */}
      <div className="grid grid-cols-[1fr_auto] gap-4 items-center mb-5">
        <Skeleton className="h-1.5 flex-1 rounded-full bg-surface-3" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-20 h-10 rounded-lg" />
          <Skeleton className="w-4 h-4 rounded" />
        </div>
      </div>

      {/* Impact section */}
      <div className="bg-surface-2 border border-border rounded-lg p-4 space-y-4">
        <Skeleton className="h-3 w-28 opacity-40 uppercase" />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-24 opacity-60" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20 opacity-60" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-32 opacity-60" />
            <Skeleton className="h-3 w-14" />
          </div>
          
          <div className="pt-3 border-t border-dashed border-border flex justify-between items-center">
            <Skeleton className="h-3 w-28 opacity-60" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
