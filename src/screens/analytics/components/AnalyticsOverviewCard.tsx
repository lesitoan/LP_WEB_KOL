import AnalyticsOverviewCardSkeleton from "@/components/skeletons/analytics/AnalyticsOverviewCardSkeleton"
import { ShieldAlert, type LucideIcon, UserPlus, UsersRound, UserX } from "lucide-react"
import { useFakeAnalyticsLoading } from "./useFakeAnalyticsLoading"

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg bg-[#28282880] p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium uppercase text-muted-foreground">
        <Icon className="h-5 w-5 text-sky-400" />
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-foreground sm:text-[32px]">{value}</div>
    </div>
  )
}

export default function AnalyticsOverviewCard() {
  const isLoading = useFakeAnalyticsLoading()

  if (isLoading) {
    return <AnalyticsOverviewCardSkeleton />
  }

  return (
    <section className="mb-5 rounded-[14px] border border-border bg-[#171717] p-4 sm:p-5">
      <h2 className="mb-4 text-base font-medium">Chỉ số tổng quan nhóm</h2>
      <div className="grid gap-3 lg:grid-cols-[1.05fr_2.15fr]">
        <div className="relative overflow-hidden rounded-lg bg-[#28282880] bg-[url('/images/analytics/hero_bg_gradient.png')] bg-cover bg-center p-6">
          <div className="relative flex min-h-[220px] flex-col items-start justify-center">
            <div className="mb-8 flex items-center gap-3">
              <img
                src="/images/bitcoin_logo.png"
                alt=""
                aria-hidden="true"
                className="h-10 w-10 shrink-0 object-contain"
              />
              <span className="text-base font-medium uppercase text-foreground">
                TỔNG SỐ HOA HỒNG
              </span>
            </div>
            <div className="text-[36px] font-bold leading-none tracking-tight text-foreground sm:text-[40px]">
              $400M
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard icon={ShieldAlert} label="Số đang bị cảnh báo" value="4" />
          <StatCard icon={UsersRound} label="Số lượng members" value="1,000" />
          <StatCard icon={UserX} label="Số bị kick" value="4" />
          <StatCard icon={UserPlus} label="Số tham gia mới" value="50" />
        </div>
      </div>
    </section>
  )
}
