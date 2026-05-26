"use client";

import type React from "react";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

interface AdminAppLayoutProps {
  children: React.ReactNode;
}

export default function AdminAppLayout({ children }: AdminAppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-dvh overflow-hidden bg-surface-0">
      <div className="max-md:hidden fixed left-0 top-0 z-30 h-dvh w-[232px]">
        <AdminSidebar />
      </div>

      {isSidebarOpen ? (
        <>
          <button
            type="button"
            aria-label="Đóng menu"
            className="md:hidden fixed inset-0 z-40 bg-black/45"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="md:hidden fixed left-0 top-0 z-50 h-dvh w-[232px]">
            <AdminSidebar onItemClick={() => setIsSidebarOpen(false)} />
          </div>
        </>
      ) : null}

      <main className="fixed inset-y-0 left-0 right-0 flex min-w-0 flex-col overflow-hidden md:left-[232px]">
        <AdminTopbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-8 max-sm:p-4 bg-surface-0 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
