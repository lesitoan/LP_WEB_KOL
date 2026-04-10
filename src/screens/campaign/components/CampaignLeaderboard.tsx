import { leaderboard } from "./campaign-data";

export default function CampaignLeaderboard() {
  return (
    <div className="py-2">
      {leaderboard.map((row) => (
        <div
          key={row.rank}
          className={`grid grid-cols-[56px_1fr_auto_auto_auto] items-center gap-4 px-6 py-4 border-b border-border last:border-b-0 hover:bg-surface-2 transition-colors cursor-pointer ${
            row.podium
              ? "bg-gradient-to-r from-[hsl(28_88%_60%/0.04)] to-transparent"
              : ""
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg grid place-items-center font-geist-mono font-semibold text-sm ${row.rankClass}`}
          >
            {row.rank}
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${row.gradient} grid place-items-center text-xs font-semibold text-foreground shrink-0`}
            >
              {row.initials}
            </div>
            <div>
              <div className="text-[13.5px] font-medium">{row.name}</div>
              <div className="text-[11px] text-muted-foreground font-geist-mono">
                {row.uid}
              </div>
            </div>
          </div>
          <div className="font-geist-mono font-semibold text-sm">{row.vol}</div>
          <div
            className={`font-geist-mono text-xs w-9 text-right ${row.trendClass}`}
          >
            {row.trend}
          </div>
          <div>
            {row.prize && (
              <span className="text-xs font-semibold text-warning bg-warning/10 px-2.5 py-1 rounded-full border border-warning/20">
                {row.prize}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
