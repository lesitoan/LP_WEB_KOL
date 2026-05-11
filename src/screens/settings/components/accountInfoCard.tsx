"use client";

import { UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountInfoSkeleton } from "@/components/skeletons/AccountInfoSkeleton";

export type AccountInfoRow = {
  label: string;
  value: string;
};

type AccountInfoCardProps = {
  rows: AccountInfoRow[];
  isLoading?: boolean;
};

export function AccountInfoCard({ rows, isLoading }: AccountInfoCardProps) {
  return (
    <Card className="lg:col-span-2 bg-surface-1 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-brand" />
          Thông tin tài khoản
        </CardTitle>
        {/* <CardDescription className="text-muted-foreground">
          Dữ liệu lấy từ API get me.
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <AccountInfoSkeleton />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="rounded-lg border border-border-strong/70 bg-surface-0/80 px-4 py-3"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {row.label}
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-foreground">{row.value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
