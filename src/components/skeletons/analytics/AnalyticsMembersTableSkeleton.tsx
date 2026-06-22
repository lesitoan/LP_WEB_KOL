import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsMembersTableSkeleton() {
  return (
    <section className="rounded-[14px] border border-border bg-[#171717] p-4 sm:p-5">
      <h2 className="mb-5 text-base font-semibold">Thống kê members theo từng nhóm</h2>
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="mb-4 grid grid-cols-[1.35fr_1fr_1fr_1fr_1fr] gap-4 text-xs font-medium text-muted-foreground">
            <div>Nhóm</div>
            <div>Số lượng members</div>
            <div>Số tham gia mới</div>
            <div>Số đang bị cảnh báo</div>
            <div>Số bị kick</div>
          </div>
          <div className="space-y-5">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="grid grid-cols-[1.35fr_1fr_1fr_1fr_1fr] items-center gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
