import AnalyticsGrowthChartSkeleton from "@/components/skeletons/analytics/AnalyticsGrowthChartSkeleton"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { growthData } from "../constants"
import { useFakeAnalyticsLoading } from "./useFakeAnalyticsLoading"

export default function AnalyticsGrowthChart() {
  const isLoading = useFakeAnalyticsLoading()

  if (isLoading) {
    return <AnalyticsGrowthChartSkeleton />
  }

  return (
    <section className="rounded-[14px] border border-border bg-[#171717] p-4 sm:p-5">
      <h2 className="mb-4 text-base font-medium">
        So sánh tốc độ tăng trưởng volume (theo nhóm)
      </h2>
      <div className="h-[290px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={growthData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.8} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0}
              className="text-[10px] sm:text-[11px]"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={42}
              className="text-[11px]"
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "hsl(var(--surface-2))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 10,
              }}
            />
            <Bar dataKey="volume" stackId="growth" fill="#0b5bd3" radius={[0, 0, 4, 4]} barSize={82} />
            <Bar dataKey="members" stackId="growth" fill="#0ea5e9" barSize={82} />
            <Bar dataKey="warning" stackId="growth" fill="#facc15" radius={[4, 4, 0, 0]} barSize={82} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
