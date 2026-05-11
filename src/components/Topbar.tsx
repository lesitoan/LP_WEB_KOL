"use client";

import { Bell, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetKolCurrentTierQuery } from "@/services/api/tierApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";

type TopbarProps = {
  onMenuClick?: () => void;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const { profile, logout } = useAuthSession();
  const { data: tierData } = useGetKolCurrentTierQuery();

  const currentTierName =
    tierData?.matchedTier?.name || tierData?.currentTier?.name || "—";
  const currentCommissionRate =
    tierData?.matchedTier?.commissionRatePct ??
    tierData?.currentTier?.commissionRatePct ??
    tierData?.kol.currentCommissionRate ??
    null;

  const tierBadgeText =
    currentCommissionRate === null
      ? `${currentTierName}`
      : `${currentTierName} · Comm. ${currentCommissionRate}%`;

  const initials = (profile?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-14 border-b border-border bg-surface-1 flex items-center px-6 gap-4 shrink-0">
      <button
        type="button"
        onClick={onMenuClick}
        className="md:hidden w-9 h-9 rounded-lg border border-border bg-surface-2 grid place-items-center text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
        aria-label="Mở menu"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      {/* <div className="flex-1 max-w-[480px] h-9 bg-surface-2 border border-border rounded-lg flex items-center px-3 gap-2 text-[13px] text-muted-foreground hover:border-border-strong transition-colors cursor-pointer">
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="min-w-0 flex-1 truncate whitespace-nowrap">Tìm member, group, giao dịch...</span>
      </div> */}

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-[hsl(40_78%_55%/0.1)] to-[hsl(40_78%_55%/0.02)] border border-[hsl(40_78%_55%/0.3)] rounded-lg text-xs font-semibold text-brand">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.5 6 6.5.5-5 4.5 1.5 6.5L12 16l-5.5 3.5L8 13 3 8.5 9.5 8z" />
          </svg>
          {tierBadgeText}
        </div>
        {/* <button className="w-9 h-9 rounded-lg grid place-items-center text-muted-foreground hover:bg-surface-3 hover:text-foreground transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full bg-brand shadow-[0_0_0_2px_hsl(var(--surface-1))]" />
        </button> */}

        {/* User avatar + menu */}
        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-xs font-medium text-foreground leading-tight">
              {profile?.name ?? "---"}
            </span>
            <span className="text-[11px] text-muted-foreground">{profile?.email ?? "—"}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full border border-border bg-surface-2 flex items-center justify-center hover:bg-surface-3 transition-colors">
                <Avatar className="h-8 w-8 border border-border/70">
                  <AvatarFallback className="bg-brand/10 text-brand text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="space-y-0.5">
                <div className="text-sm font-medium leading-none">
                  {profile?.name ?? "---"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {profile?.email ?? ""}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  router.push("/settings");
                }}
                className="gap-2"
              >
                <UserRound className="h-4 w-4" />
                Cài đặt tài khoản
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  logout();
                }}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
