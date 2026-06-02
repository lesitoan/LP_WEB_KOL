"use client";

import { useMemo } from "react";
import { toast } from "@/hooks/useToast";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useChangePasswordMutation } from "@/services/api/authApi";
import { useGetKolCurrentTierQuery } from "@/services/api/tierApi";
import { extractApiErrorMessage } from "@/services/api/baseApi";
import type { ChangePasswordFormValues } from "./components/changePasswordCard";
import { AccountInfoCard } from "./components/accountInfoCard";
import { ChangePasswordCard } from "./components/changePasswordCard";
import { TwoFactorSecurityCard } from "./components/twoFactorSecurityCard";

function formatDateTime(value?: string) {
  if (!value) return "---";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "---";
  return parsed.toLocaleString("vi-VN");
}

export function SettingsScreen() {
  const { profile, isCheckingSession, hasToken } = useAuthSession();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const { data: currentTierData } = useGetKolCurrentTierQuery(undefined, { skip: !hasToken });

  const accountRows = useMemo(
    () => [
      { label: "Họ tên", value: profile?.name || "---" },
      { label: "Email", value: profile?.email || "---" },
      { label: "Vai trò", value: profile?.role || "---" },
      // { label: "Trạng thái", value: profile?.status || "---" },
      { label: "Mã referral", value: profile?.referralCode || "---" },
      {
        label: "Tier",
        value: currentTierData?.currentTier?.name || currentTierData?.matchedTier?.name || profile?.tier || "---",
      },
      { label: "Mã Partner", value: profile?.kolCode || "---" },
      { label: "Tên hiển thị Partner", value: profile?.kolDisplayName || "---" },
      { label: "Telegram", value: profile?.telegramUsername || "---" },
      { label: "Zalo", value: profile?.zaloContact || "---" },
      // { label: "Ngôn ngữ mặc định", value: profile?.defaultLanguage || "---" },
      { label: "Lần đăng nhập gần nhất", value: formatDateTime(profile?.lastLoginAt) },
      { label: "Ngày tạo tài khoản", value: formatDateTime(profile?.createdAt) },
    ],
    [currentTierData, profile]
  );

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const result = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmPassword,
      }).unwrap();

      toast({
        variant: "success",
        title: "Đổi mật khẩu thành công",
        description: result.data?.message || "Mật khẩu của bạn đã được cập nhật.",
      });
    } catch (error) {
      const message = extractApiErrorMessage(error, "Vui lòng kiểm tra lại thông tin và thử lại.");
      toast({
        variant: "destructive",
        title: "Đổi mật khẩu thất bại",
        description: message,
      });
    }
  };

  const isProfileLoading = isCheckingSession && !profile;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <AccountInfoCard rows={accountRows} isLoading={isProfileLoading} />
        <div className="space-y-6">
          <ChangePasswordCard onSubmit={onSubmit} isSubmitting={isChangingPassword} />
          <TwoFactorSecurityCard enabled={profile?.twoFactorEnabled} />
        </div>
      </div>
    </div>
  );
}

export default SettingsScreen;
