 "use client";

import type React from "react";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-black">
      <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="max-md:hidden fixed left-0 top-16 z-30 h-[calc(100dvh-4rem)] w-[232px]">
        <Sidebar />
      </div>

      {isSidebarOpen ? (
        <>
          <button
            type="button"
            aria-label="Đóng menu"
            className="md:hidden fixed inset-0 z-40 bg-black/45"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="md:hidden fixed left-0 top-16 z-50 h-[calc(100dvh-4rem)] w-[232px]">
            <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
          </div>
        </>
      ) : null}

      <main className="relative flex min-h-dvh flex-col overflow-hidden bg-black pt-16 md:pl-[232px]">
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 top-16 z-0 bg-black bg-[url('/images/bg.png')] bg-left-top bg-no-repeat [background-size:680px_auto] md:left-[232px] max-sm:[background-size:520px_auto]" />
        <div className="relative z-10 flex-1 overflow-y-auto p-5 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
