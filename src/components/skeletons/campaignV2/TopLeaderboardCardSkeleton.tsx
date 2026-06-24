export default function TopLeaderboardCardSkeleton() {
  return (
    <div className="relative w-full rounded-[18px] bg-white/10 p-[1px] animate-pulse">
      <div className="bg-[#1C1C1E] rounded-[17px] p-4 min-h-[132px] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/10" />
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-3 w-16 rounded bg-white/10" />
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-white/10" />
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="h-4 w-28 rounded bg-white/10" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="h-4 w-24 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
