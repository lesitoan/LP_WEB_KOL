"use client";

import { useRouter } from "next/navigation";

export default function TierProgressCard() {
  const router = useRouter();
  return (
    <div className="bg-gradient-to-br from-surface-2 to-surface-1 border border-border rounded-[14px] p-6 mb-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_top_right,hsl(var(--brand-glow)),transparent_70%)] pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(40_78%_55%/0.2)] to-[hsl(40_78%_55%/0.05)] border border-[hsl(40_78%_55%/0.3)] grid place-items-center text-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="hsl(var(--brand))">
                <path d="M12 2l2.5 6 6.5.5-5 4.5 1.5 6.5L12 16l-5.5 3.5L8 13 3 8.5 9.5 8z" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground tracking-[0.1em] uppercase font-semibold">
                Tier hiện tại
              </div>
              <div className="text-[22px] font-semibold tracking-tight">Elite Partner</div>
            </div>
          </div>
          <button
            onClick={() => router.push("/tier")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium bg-surface-2 border border-border text-foreground hover:bg-surface-3 hover:border-border-strong transition-all"
          >
            Xem benefits →
          </button>
        </div>

        <div className="h-2 bg-surface-3 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-brand-dim to-brand rounded-full shadow-[0_0_12px_hsl(var(--brand-glow))] transition-all duration-600"
            style={{ width: "74.2%" }}
          />
        </div>

        <div className="flex justify-between mt-3 text-[13px]">
          <span>
            <strong className="text-foreground font-semibold">742</strong>{" "}
            <span className="text-muted-foreground">/ 1,000 active members để lên</span>{" "}
            <strong className="text-tier-legend font-semibold">LEGEND</strong>
          </span>
          <span className="text-muted-foreground">74%</span>
        </div>

        <div className="mt-4 pt-4 border-t border-border text-[13px] text-muted-foreground flex items-center gap-2">
          💪 Bạn còn <strong className="text-brand font-semibold">258 active members</strong> nữa. Với tốc độ +23/tuần, ước tính
          <strong className="text-foreground font-semibold"> ~11 tuần</strong> sẽ lên LEGEND.
        </div>
      </div>
    </div>
  );
}
