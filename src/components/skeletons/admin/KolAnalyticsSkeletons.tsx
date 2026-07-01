import { Skeleton } from '@/components/ui/skeleton'

export function KolOverviewMetricsSkeleton() {
  return (
    <div className="bg-surface-card rounded-2xl p-4 md:p-6 space-y-4 border border-border">
      <Skeleton className="h-5 w-36" />
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="bg-[#282828]/50 rounded-lg p-4 md:p-6 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-9 w-32 md:h-12" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-3.5" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function KolGrowthChartSkeleton() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex min-h-[220px] flex-1 gap-3 md:min-h-[280px]">
        <div className="flex w-8 flex-col justify-between py-4">
          {[0, 1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-2 w-7" />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <Skeleton className="h-[180px] w-full rounded-lg md:h-[238px]" />
          <div className="flex justify-between pt-4">
            {[0, 1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-2 w-10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TopKolsTableSkeleton() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full">
      <div className="space-y-2 pb-4">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="min-h-[220px] overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_130px] gap-3 border-b border-border pb-3">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="ml-auto h-3 w-20" />
        </div>
        <div className="space-y-4 pt-4">
          {[0, 1, 2, 3, 4].map((item) => (
            <div key={item} className="grid grid-cols-[60px_1fr_130px] items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="ml-auto h-5 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function KolTierDistributionSkeleton() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex h-[200px] items-center justify-center">
        <Skeleton className="h-[170px] w-[170px] rounded-full" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
