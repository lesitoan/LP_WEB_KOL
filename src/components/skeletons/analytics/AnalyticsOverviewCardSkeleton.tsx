import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsOverviewCardSkeleton() {
  return (
    <section className="mb-5 rounded-card border border-border bg-surface-card p-4 sm:p-5">
      <h2 className="mb-4 text-base font-semibold">Chỉ số tổng quan nhóm</h2>
      <div className="grid gap-3 xl:grid-cols-[1.05fr_2.15fr]">
        <div className="relative overflow-hidden rounded-control bg-surface-control/50 bg-[url('/images/analytics/hero_bg_gradient.png')] bg-cover bg-center p-6">
          <div className="relative flex min-h-[220px] flex-col items-start justify-center">
            <div className="mb-8 flex items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-end gap-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-8 w-14" />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-control bg-surface-control/50 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
