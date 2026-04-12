import type React from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh bg-surface-0">
      <div className="max-md:hidden fixed left-0 top-0 z-30 h-dvh w-[232px]">
        <Sidebar />
      </div>

      <main className="flex min-h-dvh flex-col overflow-hidden md:pl-[232px]">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-8 max-sm:p-4 bg-surface-0 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
