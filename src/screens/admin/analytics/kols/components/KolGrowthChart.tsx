import React from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  type KolAnalyticsDateRange,
  useKolGrowthChartData,
} from '../hooks/useKolGrowthChartData'
import { KolGrowthChartSkeleton } from '@/components/skeletons/admin/KolAnalyticsSkeletons'

interface KolGrowthChartProps {
  dateRange: KolAnalyticsDateRange
}

export default function KolGrowthChart({ dateRange }: KolGrowthChartProps) {
  const { data, isEmpty, query } = useKolGrowthChartData(dateRange)
  const isLoading = query.isLoading || query.isFetching
  const showChart = !isLoading && !query.isError && data.length > 0

  if (isLoading) {
    return <KolGrowthChartSkeleton />
  }

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-1">
        <h4 className="text-sm md:text-base font-semibold text-white">Tăng trưởng KOL & Thành viên</h4>
        <p className="text-xs md:text-sm text-muted-foreground">Biểu đồ theo dõi tăng trưởng theo thời gian</p>
      </div>

      <div className="flex-1 w-full min-h-[220px] md:min-h-[280px]">
        {query.isError ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-border bg-black/10 px-4 text-center text-sm text-muted-foreground">
            Không thể tải dữ liệu biểu đồ
          </div>
        ) : null}

        {isEmpty ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-border bg-black/10 px-4 text-center text-sm text-muted-foreground">
            Chưa có dữ liệu trong khoảng thời gian này
          </div>
        ) : null}

        {showChart ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#282828" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#828283"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#828283"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dx={-5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  borderColor: '#282828',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                }}
              />
              <Line
                type="monotone"
                dataKey="members"
                name="Thành viên"
                stroke="#FFFFFF"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="kols"
                name="KOL"
                stroke="#D4A74A"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  )
}
