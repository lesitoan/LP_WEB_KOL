"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { volumeChartData } from "../constants";

const legendFormatter = (value: string) => {
  const labels: Record<string, string> = {
    vip: "VIP Platinum",
    gold: "Gold Traders",
    silver: "Silver Group",
  };

  return <span className="text-sm font-normal text-zinc-200">{labels[value] ?? value}</span>;
};

export default function VolumeByGroupChart() {
  return (
    <section className="mb-4 rounded-[14px] bg-surface-2 p-5 md:p-6">
      <h2 className="mb-6 text-base font-medium text-foreground">Volume 30 ngày (theo nhóm)</h2>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={volumeChartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="hsl(var(--border-strong))" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={14}
              interval={0}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              width={46}
              domain={[0, 200]}
              ticks={[0, 50, 100, 150, 200]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => (Number(value) === 0 ? "0" : `${value}M`)}
              label={{
                value: "(VNĐ)",
                position: "top",
                offset: 12,
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
            />
            <Tooltip
              cursor={{ stroke: "hsl(var(--border-strong))" }}
              contentStyle={{
                background: "hsl(var(--surface-3))",
                border: "1px solid hsl(var(--border-strong))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number, name: string) => [`${value}M`, legendFormatter(name)]}
              labelFormatter={(value) => value || "Ngày"}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              formatter={legendFormatter}
              wrapperStyle={{ paddingBottom: 18 }}
            />
            <Line type="monotone" dataKey="vip" stroke="#f4f4f5" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="gold" stroke="#facc15" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="silver" stroke="hsl(var(--brand))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
