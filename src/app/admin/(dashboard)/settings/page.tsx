"use client";

import { AdminTwoFactorSecurityCard } from "@/screens/admin/settings/AdminTwoFactorSecurityCard";
import { useAdminAuthSession } from "@/hooks/admin/useAdminAuthSession";

export default function AdminSettingsPage() {
  const { profile } = useAdminAuthSession();

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Cài đặt quản trị</h1>
        <p className="text-sm text-muted-foreground">
          Trang cấu hình tài khoản và thiết lập dành cho quản trị viên.
        </p>
      </div>
      <AdminTwoFactorSecurityCard enabled={profile?.twoFactorEnabled} />
    </section>
  );
}
