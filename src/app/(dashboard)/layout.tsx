'use client';

import type React from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppLayout from "@/layouts/AppLayout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { PageLoading } from "@/components/ui/pageLoading";

export default function DashboardRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { hasToken, hydrated: authHydrated, isCheckingSession } = useAuthSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (authHydrated && !hasToken) {
      const redirect = pathname || "/dashboard";
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [authHydrated, hasToken, pathname, router]);

  // Until hydrated or token confirmed, keep loading UI to avoid flicker.
  if (!mounted || !authHydrated || !hasToken || isCheckingSession) {
    return <PageLoading />;
  }

  return <AppLayout>{children}</AppLayout>;
}
