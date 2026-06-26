import { Skeleton } from "@/components/ui/skeleton"

export default function MultiLineChartSkeleton({ title }: { title: string }) {
  return (
    <section className="rounded-card border border-border bg-surface-card p-4 sm:p-5">
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      <div className="flex h-[240px] items-end gap-3 sm:h-[270px]">
        <div className="flex h-full w-10 flex-col justify-between py-2">
          {[0, 1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-2 w-8" />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <Skeleton className="h-[190px] w-full rounded-[12px] sm:h-[220px]" />
          <div className="mt-3 flex justify-between">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-2 w-8" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
