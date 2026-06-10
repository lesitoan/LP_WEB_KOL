import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsOverviewCardSkeleton() {
  return (
    <section className="mb-5 rounded-[14px] border border-border bg-[#171717] p-4 sm:p-5">
      <h2 className="mb-4 text-base font-semibold">Chỉ số tổng quan nhóm</h2>
      <div className="grid gap-3 lg:grid-cols-[1.05fr_2.15fr]">
        <div className="rounded-lg bg-[#28282880] p-5">
          <div className="flex min-h-[220px] flex-col items-center justify-center">
            <Skeleton className="mb-4 h-20 w-20 rounded-full" />
            <Skeleton className="mb-3 h-3 w-14" />
            <Skeleton className="h-7 w-44" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-lg bg-[#28282880] p-4 sm:p-5">
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
