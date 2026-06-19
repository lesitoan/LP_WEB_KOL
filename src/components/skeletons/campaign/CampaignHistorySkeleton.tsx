import { Skeleton } from "@/components/ui/skeleton";

function HistoryCardSkeleton() {
  return (
    <div className="relative flex-shrink-0 w-[85%] md:w-auto md:flex-1 bg-[#171717] rounded-[20px] overflow-hidden border border-white/5 flex flex-col snap-start">
      {/* Header gradient area */}
      <div className="relative pt-5 px-5 pb-8 bg-gradient-to-r from-white/5 via-white/[0.03] to-white/5">
        <div className="flex justify-between items-start pl-2">
          <div className="flex-1 mr-3 space-y-1.5">
            <Skeleton className="h-3.5 w-36 bg-white/10" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 -mt-5 bg-[#171717] rounded-t-[20px] p-5 flex-1 flex flex-col justify-between">
        {/* Stats */}
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 bg-white/5" />
            <Skeleton className="h-4 w-10 bg-white/10" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-8 bg-white/5" />
            <Skeleton className="h-4 w-20 bg-white/10" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20 bg-white/5" />
            <Skeleton className="h-4 w-20 bg-white/10" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/5 my-5" />

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-9 w-24 rounded-[10px] bg-white/5" />
          <Skeleton className="h-10 w-32 rounded-[12px] bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function CampaignHistorySkeleton() {
  return (
    <div className="mt-12 mb-8">
      <h3 className="text-[16px] font-semibold mb-5 text-white">
        Các chiến dịch đã tạo
      </h3>

      <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {Array.from({ length: 3 }).map((_, idx) => (
          <HistoryCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}
