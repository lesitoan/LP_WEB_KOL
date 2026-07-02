import { Skeleton } from "@/components/ui/skeleton";

export function ContentOverviewMetricsSkeleton() {
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