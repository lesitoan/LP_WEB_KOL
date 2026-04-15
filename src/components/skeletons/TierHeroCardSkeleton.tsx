import { Skeleton } from "@/components/ui/skeleton";

export function TierHeroCardSkeleton() {
  return (
    <div className="bg-[radial-gradient(ellipse_at_center_top,hsl(40_78%_55%/0.15),transparent_60%),linear-gradient(180deg,hsl(var(--surface-2)),hsl(var(--surface-1)))] border border-border rounded-[20px] px-8 py-10 text-center mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(40_78%_55%/0.08),transparent_40%),radial-gradient(circle_at_80%_60%,hsl(28_88%_60%/0.05),transparent_40%)] pointer-events-none" />
      <div className="relative max-w-[520px] mx-auto">
        <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-[14px]" />
        <Skeleton className="h-3 w-28 mx-auto mb-2" />
        <Skeleton className="h-8 w-40 mx-auto mb-6" />

        <div className="max-w-[480px] mx-auto mb-4">
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex justify-between mt-3 text-[13px]">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <Skeleton className="h-4 w-64 mx-auto mb-4" />

        <div className="inline-flex flex-col gap-2 text-left mx-auto mt-5 p-4 px-5 bg-surface-2 border border-border rounded-lg w-full max-w-[420px]">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  );
}
