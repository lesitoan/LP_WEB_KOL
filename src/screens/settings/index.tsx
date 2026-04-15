"use client";

import { useMemo } from "react";
import { toast } from "@/hooks/useToast";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useChangePasswordMutation } from "@/services/api/authApi";
import { extractApiErrorMessage } from "@/services/api/baseApi";
import type { ChangePasswordFormValues } from "./components/changePasswordCard";
import { AccountInfoCard } from "./components/accountInfoCard";
import { ChangePasswordCard } from "./components/changePasswordCard";

function formatDateTime(value?: string) {
  if (!value) return "---";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "---";
  return parsed.toLocaleString("vi-VN");
}

export function SettingsScreen() {
  const { profile, isCheckingSession } = useAuthSession();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const accountRows = useMemo(
    () => [
      { label: "Họ tên", value: profile?.name || "---" },
      { label: "Email", value: profile?.email || "---" },
      { label: "Vai trò", value: profile?.role || "---" },
      { label: "Trạng thái", value: profile?.status || "---" },
      { label: "Mã referral", value: profile?.referralCode || "---" },
      { label: "Tier", value: profile?.tier || "---" },
      { label: "Mã KOL", value: profile?.kolCode || "---" },
      { label: "Tên hiển thị KOL", value: profile?.kolDisplayName || "---" },
      { label: "Telegram", value: profile?.telegramContact || "---" },
      { label: "Zalo", value: profile?.zaloContact || "---" },
      { label: "Ngôn ngữ mặc định", value: profile?.defaultLanguage || "---" },
      { label: "Lần đăng nhập gần nhất", value: formatDateTime(profile?.lastLoginAt) },
      { label: "Ngày tạo tài khoản", value: formatDateTime(profile?.createdAt) },
    ],
    [profile]
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
        <ChangePasswordCard onSubmit={onSubmit} isSubmitting={isChangingPassword} />
      </div>
    </div>
  );
}

export default SettingsScreen;
