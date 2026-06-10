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
      <div className="rounded-[14px] bg-[#171717] p-4 md:p-5">
        <div className="mb-5 grid grid-cols-3 divide-x divide-[#262626]">
          {[0, 1, 2].map((col) => (
            <div key={col} className="flex flex-col items-center justify-center gap-1.5 px-2 py-2 md:gap-2 md:px-4 md:py-3">
              <Skeleton className="h-5 w-12 md:h-8 md:w-16" />
              <Skeleton className="h-2.5 w-16 md:h-3 md:w-24" />
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
