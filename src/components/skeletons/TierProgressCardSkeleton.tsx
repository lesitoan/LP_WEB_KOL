import { Skeleton } from "@/components/ui/skeleton";

export function TierProgressCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-surface-2 to-surface-1 border border-border rounded-card p-6 mb-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_top_right,hsl(var(--brand-glow)),transparent_70%)] pointer-events-none" />
      <div className="relative space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
