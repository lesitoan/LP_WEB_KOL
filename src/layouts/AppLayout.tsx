import type React from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden max-md:flex-col">
      <div className="max-md:hidden">
        <Sidebar />
      </div>
      <main className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-8 max-sm:p-4 bg-surface-0 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
