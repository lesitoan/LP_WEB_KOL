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
import { growthChartData } from '../constants'

export default function KolGrowthChart() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-1">
        <h4 className="text-sm md:text-base font-semibold text-white">Tăng trưởng KOL & Thành viên</h4>
        <p className="text-xs md:text-sm text-muted-foreground">Biểu đồ theo dõi tăng trưởng theo thời gian</p>
      </div>

      <div className="flex-1 w-full min-h-[220px] md:min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={growthChartData}
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
              dataKey="Thành viên"
              stroke="#FFFFFF"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="KOL"
              stroke="#D4A74A"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
