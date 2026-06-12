import { Skeleton } from "@/components/ui/skeleton";

export function TierSummaryCardSkeleton() {
  return (
    <section className="relative mb-4 overflow-hidden rounded-[14px] border-2 border-yellow-200 bg-surface-2 p-5 shadow-[10px_0_24px_rgba(250,255,0,0.16)] md:p-6">
      <div className="mb-5">
        <Skeleton className="h-5 w-56" />
      </div>
      <div className="grid items-center gap-6 lg:grid-cols-[300px_1fr_124px] 2xl:grid-cols-[360px_1fr_124px]">
        <div className="flex items-center gap-5 lg:border-r lg:border-border-strong lg:pr-7">
          <Skeleton className="h-[92px] w-[92px] rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </div>
        <div className="space-y-4 lg:border-l lg:border-border-strong lg:pl-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </section>
  );
}