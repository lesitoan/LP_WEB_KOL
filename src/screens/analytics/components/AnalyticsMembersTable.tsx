import AnalyticsMembersTableSkeleton from "@/components/skeletons/analytics/AnalyticsMembersTableSkeleton"
import { groupRows } from "../constants"
import { useFakeAnalyticsLoading } from "./useFakeAnalyticsLoading"

export default function AnalyticsMembersTable() {
  const isLoading = useFakeAnalyticsLoading()

  if (isLoading) {
    return <AnalyticsMembersTableSkeleton />
  }

  return (
    <section className="rounded-[14px] border border-border bg-[#171717] p-4 sm:p-5">
      <h2 className="mb-5 text-base font-medium">Thống kê members theo từng nhóm</h2>
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
          <tbody className="divide-y divide-transparent text-base  font-normal">
            {groupRows.map((row) => (
              <tr key={row.name}>
                <td className="py-3 ">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/avatar_default.png"
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                    <span className="font-medium text-foreground">{row.name}</span>
                  </div>
                </td>
                <td className="py-3 text-foreground">{row.members.toLocaleString("en-US")}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{row.joins}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-normal ${
                        row.change > 0
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {Math.abs(row.change)}% {row.change > 0 ? "▲" : "▼"}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-foreground">{row.warning}</td>
                <td className="py-3 text-foreground">{row.kicked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
