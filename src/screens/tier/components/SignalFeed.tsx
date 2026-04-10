import { signals } from "./tier-data";

export default function SignalFeed() {
  return (
    <div>
      {signals.map((s, i) => (
        <div key={i} className="bg-surface-1 border border-border rounded-[14px] p-5 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              {s.icon} {s.title}
            </div>
            <div className="text-[11px] text-muted-foreground font-geist-mono">
              {s.time}
            </div>
          </div>
          <div className="text-[13.5px] text-muted-foreground mb-3">{s.body}</div>
          <div className="p-3 bg-surface-2 border-l-2 border-brand rounded-r-md text-[13px] mb-3">
            <strong className="text-brand">→ Insight:</strong>{" "}
            <span className="text-muted-foreground">{s.insight}</span>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-2 border border-border text-foreground hover:bg-surface-3 transition-all">
              📋 Copy text
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand text-primary-foreground hover:bg-brand-dim transition-all">
              💬 Forward đến groups
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
