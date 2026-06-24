import TopLeaderboardCardSkeleton from "./TopLeaderboardCardSkeleton";

export default function CampaignLeaderboardSectionSkeleton() {
  return (
    <div>
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-[24px] font-semibold text-white mb-4">Bảng xếp hạng</h3>
        <div className="h-10 w-72 rounded-full bg-white/10 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 min-[576px]:grid-cols-3 gap-2 mb-6 animate-pulse">
        <TopLeaderboardCardSkeleton />
        <TopLeaderboardCardSkeleton />
        <TopLeaderboardCardSkeleton />
      </div>

      <div className="w-full bg-[#171717] rounded-2xl border border-white/5 overflow-hidden py-3 animate-pulse">
        <div className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] gap-4 px-4 py-2">
          <div className="h-3 w-14 rounded bg-white/10" />
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="h-3 w-24 rounded bg-white/10 justify-self-end md:justify-self-start" />
        </div>
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] items-center gap-4 px-4 py-3.5"
          >
            <div className="h-4 w-4 rounded bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="h-3 w-16 rounded bg-white/10" />
              </div>
            </div>
            <div className="h-4 w-24 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
