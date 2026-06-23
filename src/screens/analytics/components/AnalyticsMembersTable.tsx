import AnalyticsMembersTableSkeleton from "@/components/skeletons/analytics/AnalyticsMembersTableSkeleton"
import { useGetKolDashboardGroupStatsQuery } from "@/services/api/dashboardApi"
import { GroupLogoBadge } from "@/screens/groups/components/groupLogoBadge"

export default function AnalyticsMembersTable() {
  const { data: groupStats = [], isLoading, isFetching } = useGetKolDashboardGroupStatsQuery()

  if (isLoading) {
    return <AnalyticsMembersTableSkeleton />
  }

  return (
    <section className={`rounded-card border border-border bg-surface-card p-4 sm:p-5 ${isFetching ? "opacity-80" : ""}`}>
      <h2 className="mb-5 text-base font-medium">Thống kê thành viên theo từng nhóm</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-sm font-normal text-muted-foreground">
              <th className="pb-4">Nhóm</th>
              <th className="pb-4">Số lượng members</th>
              <th className="pb-4">Số tham gia mới</th>
              <th className="pb-4">Số đang bị cảnh báo</th>
              <th className="pb-4">Số bị kick</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent text-base font-normal">
            {groupStats.map((row) => (
              <tr key={row.group.id}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <GroupLogoBadge
                      iconKey={row.group.iconKey}
                      title={row.group.title}
                      className="h-7 w-8"
                      textClassName="text-sm"
                    />
                    <span className="font-medium text-foreground">{row.group.title}</span>
                  </div>
                </td>
                <td className="py-3 text-foreground">{row.referralCount.toLocaleString("en-US")}</td>
                <td className="py-3 text-foreground">{row.newJoinCount.toLocaleString("en-US")}</td>
                <td className="py-3 text-foreground">{row.warningMemberCount.toLocaleString("en-US")}</td>
                <td className="py-3 text-foreground">{row.kickedMemberCount.toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
