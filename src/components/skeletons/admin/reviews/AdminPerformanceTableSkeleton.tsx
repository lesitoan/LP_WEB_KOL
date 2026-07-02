import { Skeleton } from '@/components/ui/skeleton'

export function AdminPerformanceTableSkeleton() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-2">
        <Skeleton className="h-5 w-56" />
      </div>

      <div className="min-h-[360px] overflow-hidden rounded-card border-t border-border-strong bg-surface-card">
        <div className="grid grid-cols-[220px_100px_220px_100px_150px_120px] gap-4 px-3 py-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className="h-3 w-20" />
          ))}
        </div>

        <div className="space-y-4 px-3 py-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
            <div key={row} className="grid grid-cols-[220px_100px_220px_100px_150px_120px] items-center gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-28" />
              </div>
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
