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
      <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase text-muted-foreground sm:text-xs">
        <Icon className="h-5 w-5 text-sky-400" />
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">{value}</div>
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
      <h2 className="mb-4 text-base font-semibold">Chỉ số tổng quan nhóm</h2>
      <div className="grid gap-3 lg:grid-cols-[1.05fr_2.15fr]">
        <div className="relative overflow-hidden rounded-lg bg-[#28282880] bg-[url('/images/analytics/hero_bg_gradient.png')] bg-cover bg-center p-5 text-center">
          <div className="relative flex min-h-[220px] flex-col items-center justify-center">
            <img
              src="/images/tier_icons/tier_logo.png"
              alt="VIP Platinum"
              className="mb-4 h-20 w-20 object-contain"
            />
            <div className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Nhóm</div>
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
              VIP Platinum
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
