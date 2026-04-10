"use client";

import { useRouter } from "next/navigation";

const kpis = [
  { label: "Active Members", value: "742", delta: "▲ +23 (7 ngày)", up: true },
  { label: "Volume 30 ngày", value: "$42.8M", delta: "▲ +12% (7 ngày)", up: true },
  { label: "Cashback tháng này", value: "$6,236", delta: "▲ +8% vs T3", up: true },
  { label: "Commission", value: "$12,840", delta: "▲ +$1,200", up: true },
];

export default function KpiGrid() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-4 gap-4 mb-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-surface-1 border border-border rounded-[14px] p-5 relative transition-all hover:border-border-strong hover:-translate-y-0.5 cursor-pointer"
          onClick={() => router.push("/members")}
        >
          <div className="text-[11px] font-semibold text-muted-foreground tracking-[0.08em] uppercase mb-3">
            {kpi.label}
          </div>
          <div className="text-[28px] font-semibold tracking-tight font-geist-mono mb-2">
            {kpi.value}
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-medium font-geist-mono text-success">
            {kpi.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
