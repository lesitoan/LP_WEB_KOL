"use client";

import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { useAdminAuthSession } from "@/hooks/admin/useAdminAuthSession";

type TopbarProps = {
  onMenuClick?: () => void;
};

export default function AdminTopbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const { profile, logout } = useAdminAuthSession();

  const initials = (profile?.name || "AD")
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

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-[hsl(40_78%_55%/0.1)] to-[hsl(40_78%_55%/0.02)] border border-[hsl(40_78%_55%/0.3)] rounded-lg text-xs font-semibold text-brand">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.5 6 6.5.5-5 4.5 1.5 6.5L12 16l-5.5 3.5L8 13 3 8.5 9.5 8z" />
          </svg>
          Quản trị hệ thống
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-xs font-medium text-foreground leading-tight">
              {profile?.name ?? "Quản trị viên"}
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
                  {profile?.name ?? "Quản trị viên"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {profile?.email ?? ""}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  router.push("/admin/settings");
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
