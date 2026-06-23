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

const volumeLabelByKey: Record<string, string> = {
  vip: "VIP Platinum",
  gold: "Gold Traders",
  silver: "Silver Group",
};

const legendFormatter = (value: string) => {
  return <span className="text-[10px] font-normal text-zinc-200 md:text-sm">{volumeLabelByKey[value] ?? value}</span>;
};

type TooltipPayloadItem = {
  dataKey?: string | number;
  value?: number | string;
  color?: string;
};

function formatFullVnd(value: number) {
  return `${Math.round(value * 1_000_000).toLocaleString("vi-VN")} VNĐ`;
}

function renderVolumeTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border-strong bg-surface-3 px-3 py-2 text-sm shadow-lg">
      <div className="space-y-1.5">
        {payload.map((item) => {
          const dataKey = String(item.dataKey ?? "");
          const value = Number(item.value ?? 0);

          return (
            <div key={dataKey} className="whitespace-nowrap font-medium" style={{ color: item.color }}>
              {volumeLabelByKey[dataKey] ?? dataKey}: {formatFullVnd(value)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function VolumeByGroupChart() {
  return (
    <section className="mb-4 rounded-card bg-surface-2 p-5 md:p-6">
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
              content={renderVolumeTooltip}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={10}
              formatter={legendFormatter}
              wrapperStyle={{ paddingBottom: 18, fontSize: 10 }}
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
