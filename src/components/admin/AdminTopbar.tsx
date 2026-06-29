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
    <header className="md:hidden h-14 border-b border-border bg-surface-1 flex items-center px-6 gap-4 shrink-0">
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
        

        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-xs font-medium text-foreground leading-tight">
              {profile?.name ?? "Quản trị viên"}
            </span>
            <span className="text-[11px] text-muted-foreground">{profile?.email ?? "—"}</span>
          </div>
          {/*   */}
        </div>
      </div>
    </header>
  );
}
