export default function CampaignHistoryScrollerSkeleton() {
  return (
    <div className="mt-6 mb-6">
      <h3 className="text-[20px] font-semibold text-white mb-4">
        Các chiến dịch đã tạo
      </h3>
      <div className="flex items-center gap-2 mb-5 animate-pulse">
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className="h-9 w-28 rounded-full bg-white/10" />
        ))}
      </div>
      <div className="flex gap-4 overflow-hidden animate-pulse">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="min-w-[280px] flex-1 rounded-[18px] bg-[#171717] border border-white/5 overflow-hidden"
          >
            <div className="h-20 bg-white/10" />
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="h-10 rounded bg-white/10" />
                <div className="h-10 rounded bg-white/10" />
                <div className="h-10 rounded bg-white/10" />
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="h-9 w-32 rounded bg-white/10" />
                <div className="flex gap-2">
                  <div className="h-9 w-9 rounded bg-white/10" />
                  <div className="h-9 w-9 rounded bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
