"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthSession } from "@/hooks/useAuthSession";
import { defaultDateRange } from "../constants";

function formatLastUpdated(value: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export default function DashboardHeader() {
  const { profile } = useAuthSession();
  const searchParams = useSearchParams();
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => new Date());
  const displayName = profile?.kolDisplayName || profile?.name || "Olivia";
  const selectedSegment = searchParams.get("segment") || "all";
  const from = searchParams.get("from") || defaultDateRange.from;
  const to = searchParams.get("to") || defaultDateRange.to;

  useEffect(() => {
    setLastUpdatedAt(new Date());
  }, [from, selectedSegment, to]);

  return (
    <header className="mb-7">
      <h1 className="text-[30px] font-normal leading-tight tracking-normal text-foreground sm:text-[32px]">
        Xin chào, {displayName} <img src="/images/icons/hand_icon.svg" alt="" className="inline h-7 w-7 align-[-0.1em]" />
      </h1>
      <p className="mt-0.5 text-sm font-normal text-zinc-300">Cập nhật lần cuối: {formatLastUpdated(lastUpdatedAt)}</p>
    </header>
  );
}
