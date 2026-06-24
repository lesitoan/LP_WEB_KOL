export default function CampaignSummaryBannerSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 bg-[#13110C] border border-[#2A2416] min-h-[140px] md:min-h-[160px] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2A210F]/60 via-[#171717] to-[#2A210F]/60" />
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between w-full p-4 md:px-6 md:py-6 gap-4 h-full">
        <div className="lg:ml-[23%] xl:ml-[18%] space-y-3">
          <div className="h-4 w-44 rounded bg-white/10" />
          <div className="h-8 w-56 rounded bg-white/10" />
        </div>
        <div className="flex items-center justify-between bg-[#1C1C1E]/90 border border-white/5 rounded-[11px] py-4 px-4 gap-4 w-full lg:w-auto">
          {[0, 1, 2].map((item) => (
            <div key={item} className="min-w-[96px] space-y-3">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-6 w-20 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
