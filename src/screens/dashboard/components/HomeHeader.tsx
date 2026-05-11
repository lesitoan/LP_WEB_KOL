"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/useAuthSession";

const AUTO_REFRESH_MS = 30 * 60 * 1000;
const DASHBOARD_REFRESH_EVENT = "dashboard:refresh-request";

export default function HomeHeader() {
  const router = useRouter();
  const { profile } = useAuthSession();
  const displayName = profile?.kolDisplayName || profile?.name || "---";
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [lastSyncedAt, setLastSyncedAt] = useState<Date>(() => new Date());
  const [nextRefreshAt, setNextRefreshAt] = useState<Date>(() => new Date(Date.now() + AUTO_REFRESH_MS));
  const [now, setNow] = useState<Date>(() => new Date());

  const triggerRefresh = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setLastSyncedAt(new Date());
    setNextRefreshAt(new Date(Date.now() + AUTO_REFRESH_MS));
    window.dispatchEvent(new CustomEvent(DASHBOARD_REFRESH_EVENT));

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (now.getTime() < nextRefreshAt.getTime()) return;
    triggerRefresh();
  }, [nextRefreshAt, now]);

  const syncedAtLabel = useMemo(
    () =>
      lastSyncedAt.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [lastSyncedAt],
  );

  const minutesToNextRefresh = Math.max(0, Math.ceil((nextRefreshAt.getTime() - now.getTime()) / 60000));
  const nextRefreshLabel = minutesToNextRefresh <= 0 ? "dưới 1 phút" : `${minutesToNextRefresh} phút`;

  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight mb-0.5">Chào {displayName} 👋</h1>
        <div className="text-[13px] text-muted-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success)/0.5)] animate-pulse-dot" />
          Đồng bộ lúc {syncedAtLabel} · Lần kế tiếp trong {nextRefreshLabel}
          <button
            type="button"
            onClick={triggerRefresh}
            disabled={isRefreshing}
            className="text-xs px-2 py-0.5 rounded hover:bg-surface-2 text-muted-foreground transition-colors disabled:opacity-60"
          >
            {isRefreshing ? "Đang refresh..." : "⟳ Refresh"}
          </button>
        </div>
      </div>
      <button
        onClick={() => router.push("/groups?openform=true")}
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
