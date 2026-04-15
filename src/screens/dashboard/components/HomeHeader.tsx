"use client";

import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function HomeHeader() {
  const router = useRouter();
  const { profile } = useAuthSession();
  const displayName = profile?.kolDisplayName || profile?.name || "---";

  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight mb-0.5">Chào {displayName} 👋</h1>
        <div className="text-[13px] text-muted-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success)/0.5)] animate-pulse-dot" />
          Đồng bộ lúc 14:32 · Lần kế tiếp trong 18 phút
          <button className="text-xs px-2 py-0.5 rounded hover:bg-surface-2 text-muted-foreground transition-colors">
            ⟳ Refresh
          </button>
        </div>
      </div>
      <button
        onClick={() => router.push("/groups?dialog=create")}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold bg-brand text-primary-foreground hover:bg-brand-dim hover:-translate-y-px hover:shadow-[0_4px_12px_hsl(var(--brand-glow))] transition-all"
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Tạo group mới
      </button>
    </div>
  );
}
