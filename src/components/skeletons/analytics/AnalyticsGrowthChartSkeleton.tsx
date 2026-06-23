import { Skeleton } from "@/components/ui/skeleton"

const bars = [
  { height: "h-[62%]" },
  { height: "h-[78%]" },
  { height: "h-[52%]" },
  { height: "h-[70%]" },
]

export default function AnalyticsGrowthChartSkeleton() {
  return (
    <section className="rounded-card border border-border bg-surface-card p-4 sm:p-5">
      <h2 className="mb-4 text-sm font-semibold">
        So sánh tốc độ tăng trưởng volume (theo nhóm)
      </h2>
      <div className="flex h-[290px] gap-3">
        <div className="flex h-full w-10 flex-col justify-between py-2">
          {[0, 1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-2 w-7" />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 items-end justify-around gap-6 pb-6">
          {bars.map((bar, index) => (
            <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
              <Skeleton className={`${bar.height} w-[82px] max-w-full rounded-t-md`} />
              <Skeleton className="h-2 w-16" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
