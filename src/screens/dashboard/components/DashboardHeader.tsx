"use client";

import { useAuthSession } from "@/hooks/useAuthSession";

export default function DashboardHeader() {
  const { profile } = useAuthSession();
  const displayName = profile?.kolDisplayName || profile?.name || "Olivia";

  return (
    <header className="mb-7">
      <h1 className="text-[30px] font-normal leading-tight tracking-normal text-foreground sm:text-[32px]">
        Xin chào, {displayName} <span className="text-yellow-300">👋</span>
      </h1>
      <p className="mt-0.5 text-sm font-normal text-zinc-300">Cập nhật lần cuối: 15:32</p>
    </header>
  );
}
