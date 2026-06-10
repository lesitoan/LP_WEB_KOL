import { Skeleton } from "@/components/ui/skeleton";

export function TierHeroCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-[2px] mb-6"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(255, 234, 116, 0.5) 0%, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0) 65%, rgba(255, 234, 116, 0.5) 100%)',
      }}
    >
      <div className="rounded-[14px] bg-[#171717] p-5">
        <div className="grid grid-cols-3 divide-x divide-[#262626] mb-5">
          {[0, 1, 2].map((col) => (
            <div key={col} className="flex flex-col items-center justify-center px-4 py-3 gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-white/[0.06] backdrop-blur-[20px] p-4 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
    </div>
  );
}
