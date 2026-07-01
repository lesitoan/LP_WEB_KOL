import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { useKolTierDistributionData } from '../hooks/useKolTierDistributionData'
import { KolTierDistributionSkeleton } from '@/components/skeletons/admin/KolAnalyticsSkeletons'

export default function KolTierDistribution() {
  const { data, isEmpty, query, totalKols } = useKolTierDistributionData()
  const isLoading = query.isLoading || query.isFetching
  const showChart = !isLoading && !query.isError && data.length > 0

  if (isLoading) {
    return <KolTierDistributionSkeleton />
  }

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-1">
        <h4 className="text-sm md:text-base font-semibold text-white">Cơ cấu KOL theo tier</h4>
        <p className="text-xs md:text-sm text-muted-foreground">Phân bổ {totalKols} KOL</p>
      </div>

      <div className="relative h-[200px] w-full flex items-center justify-center">
        {query.isError ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-border bg-black/10 px-4 text-center text-sm text-muted-foreground">
            Không thể tải dữ liệu phân bổ tier
          </div>
        ) : null}

        {isEmpty ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-border bg-black/10 px-4 text-center text-sm text-muted-foreground">
            Chưa có dữ liệu tier
          </div>
        ) : null}

        {showChart ? (
          <>
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.map((entry) => (
                      <Cell key={entry.code} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center z-10">
              <span className="text-[32px] font-bold text-white block leading-[48px]">{totalKols}</span>
              <span className="text-sm font-normal text-white block">KOL</span>
            </div>
          </>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2">
        {data.map((item) => (
          <div key={item.code} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs md:text-sm font-normal text-white">
              {item.code}: <span className="font-semibold">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
