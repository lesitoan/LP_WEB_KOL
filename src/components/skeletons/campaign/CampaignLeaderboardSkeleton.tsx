import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignLeaderboardSkeleton() {
  return (
    <div>
      {/* Podium Top 3 */}
      <div className="flex gap-3 mb-6 items-end pb-2">
        {/* Rank 2 */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative p-[1.75px] rounded-[18px] bg-gradient-to-b from-[#FFF6DF]/30 to-transparent h-[165px] md:h-[185px]">
            <div className="h-full bg-[#1C1C1E] rounded-[16px] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-[42px] h-[42px] rounded-full bg-white/10" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24 bg-white/10" />
                    <Skeleton className="h-3 w-16 bg-white/5" />
                  </div>
                </div>
                <Skeleton className="w-12 h-12 rounded-lg bg-white/5" />
              </div>
              <div>
                <div className="h-px w-full bg-white/5 mb-4" />
                <div className="flex justify-between items-end">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16 bg-white/5" />
                    <Skeleton className="h-5 w-28 bg-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16 bg-white/5" />
                    <Skeleton className="h-5 w-20 bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rank 1 */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative p-[1.75px] rounded-[18px] bg-gradient-to-b from-[#FFD255]/30 to-transparent h-[190px] md:h-[210px]">
            <div className="h-full bg-[#1C1C1E] rounded-[16px] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-[42px] h-[42px] rounded-full bg-white/10" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 bg-white/10" />
                    <Skeleton className="h-3 w-16 bg-white/5" />
                  </div>
                </div>
                <Skeleton className="w-12 h-12 rounded-lg bg-white/5" />
              </div>
              <div>
                <div className="h-px w-full bg-white/5 mb-4" />
                <div className="flex justify-between items-end">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16 bg-white/5" />
                    <Skeleton className="h-5 w-32 bg-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16 bg-white/5" />
                    <Skeleton className="h-5 w-20 bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rank 3 */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative p-[1.75px] rounded-[18px] bg-gradient-to-b from-[#FF9655]/30 to-transparent h-[145px] md:h-[165px]">
            <div className="h-full bg-[#1C1C1E] rounded-[16px] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-[42px] h-[42px] rounded-full bg-white/10" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-20 bg-white/10" />
                    <Skeleton className="h-3 w-16 bg-white/5" />
                  </div>
                </div>
                <Skeleton className="w-12 h-12 rounded-lg bg-white/5" />
              </div>
              <div>
                <div className="h-px w-full bg-white/5 mb-4" />
                <div className="flex justify-between items-end">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16 bg-white/5" />
                    <Skeleton className="h-5 w-24 bg-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16 bg-white/5" />
                    <Skeleton className="h-5 w-20 bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Rank 4+ */}
      <div className="w-full mt-6 bg-[#171717] rounded-2xl border border-white/5 overflow-hidden py-3">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] items-center gap-2 md:gap-4 px-4 py-2">
          <Skeleton className="h-3 w-12 bg-white/5" />
          <Skeleton className="h-3 w-14 bg-white/5" />
          <Skeleton className="h-3 w-20 bg-white/5" />
        </div>

        {/* Table Rows */}
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] items-center gap-2 md:gap-4 px-4 py-3 md:py-3.5"
          >
            <Skeleton className="h-4 w-5 bg-white/5" />
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <Skeleton className="w-[42px] h-[42px] rounded-full bg-white/10 shrink-0" />
              <div className="space-y-1.5 min-w-0">
                <Skeleton className="h-4 w-28 bg-white/10" />
                <Skeleton className="h-3 w-16 bg-white/5" />
              </div>
            </div>
            <Skeleton className="h-4 w-24 bg-white/8" />
          </div>
        ))}
      </div>
    </div>
  );
}
