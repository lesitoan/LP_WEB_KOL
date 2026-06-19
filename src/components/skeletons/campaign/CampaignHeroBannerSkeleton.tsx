import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignHeroBannerSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 bg-[#13110C] border border-[#2A2416] flex flex-col justify-center min-h-[140px] md:min-h-[160px]">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between w-full p-4 md:px-6 md:py-6 gap-4">

        {/* Title & Month */}
        <div className="shrink-0 flex flex-col items-center lg:items-start lg:ml-[18%] w-full lg:w-auto gap-2">
          <Skeleton className="h-5 w-44 bg-white/5" />
          <Skeleton className="h-10 w-36 bg-[#F5C35A]/10" />
        </div>

        {/* Stats Block */}
        <div className="flex flex-row items-center justify-between bg-[#1C1C1E]/90 lg:bg-[#1C1C1E]/95 border border-white/5 rounded-2xl py-3 px-2 md:px-8 md:py-4 gap-1 md:gap-8 shadow-xl w-full lg:w-auto">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col justify-center items-center lg:items-start flex-1 min-w-0 gap-2">
              <Skeleton className="h-3.5 w-20 bg-white/5" />
              <Skeleton className={`h-5 ${i === 2 ? "w-20 bg-[#F5C35A]/10" : i === 1 ? "w-24 bg-white/8" : "w-14 bg-white/8"}`} />
              {i < 2 && <div className="absolute" />}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
