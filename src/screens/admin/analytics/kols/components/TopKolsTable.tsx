import React from 'react'
import {
  type KolAnalyticsDateRange,
} from '../hooks/useKolGrowthChartData'
import { useTopKolsCommissionData } from '../hooks/useTopKolsCommissionData'

interface TopKolsTableProps {
  dateRange: KolAnalyticsDateRange
}

export default function TopKolsTable({ dateRange }: TopKolsTableProps) {
  const { isEmpty, query, rows } = useTopKolsCommissionData(dateRange)
  const isLoading = query.isLoading || query.isFetching
  const showRows = !isLoading && !query.isError && rows.length > 0

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full">
      <div className="space-y-1 pb-4">
        <h4 className="text-sm md:text-base font-semibold text-white">Top KOL theo hoa hồng</h4>
        <p className="text-xs md:text-sm text-muted-foreground">Kỳ hôm nay</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        {isLoading ? (
          <div className="h-full min-h-[220px] w-full animate-pulse rounded-lg bg-white/5" />
        ) : null}

        {query.isError ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-border bg-black/10 px-4 text-center text-sm text-muted-foreground">
            Không thể tải dữ liệu hoa hồng
          </div>
        ) : null}

        {isEmpty ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-border bg-black/10 px-4 text-center text-sm text-muted-foreground">
            Chưa có dữ liệu hoa hồng
          </div>
        ) : null}

        {showRows ? (
          <table className="w-full min-w-[420px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-normal text-muted-foreground">
                <th className="py-2.5 px-1.5 md:py-3 md:px-2 w-[60px] font-normal">STT</th>
                <th className="py-2.5 px-1.5 md:py-3 md:px-2 font-normal">Chi tiết hoạt động</th>
                <th className="py-2.5 px-1.5 md:py-3 md:px-2 text-right font-normal">Hoa hồng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((kol) => (
                <tr key={kol.id} className="border-b border-border/40 hover:bg-surface-2/30 transition-colors">
                  <td className="py-3 px-1.5 md:py-4 md:px-2 text-sm md:text-base font-normal text-[#D7D8D9]">{kol.stt}</td>
                  <td className="py-3 px-1.5 md:py-4 md:px-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-sm md:text-base font-semibold text-white">{kol.name}</span>
                      {/* Tier is hidden for now because the commissions API does not return tier data. */}
                    </div>
                  </td>
                  <td className="py-3 px-1.5 md:py-4 md:px-2 text-right text-sm md:text-base font-normal text-white">{kol.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  )
}
