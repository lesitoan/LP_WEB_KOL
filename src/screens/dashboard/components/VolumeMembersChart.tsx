export default function VolumeMembersChart() {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const heights = [65, 72, 58, 80, 75, 88, 92];

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
          Volume & Members
        </div>
        <span className="text-[12px] text-muted-foreground">7 ngày gần nhất</span>
      </div>
      <div className="h-60 flex items-end justify-between gap-2 px-2">
        {heights.map((h, i) => (
          <div key={days[i]} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-gradient-to-t from-brand-dim to-brand rounded-t"
              style={{ height: `${h}%` }}
            />
            <span className="text-[10px] text-muted-foreground font-geist-mono">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
