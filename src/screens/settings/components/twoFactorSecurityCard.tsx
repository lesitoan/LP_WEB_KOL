"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCode } from "@/components/QRCode";
import { SixDigitCodeInput } from "@/components/SixDigitCodeInput";
import { toast } from "@/hooks/useToast";
import { extractApiErrorMessage } from "@/services/api/baseApi";
import {
  useDisableTwoFactorMutation,
  useEnableTwoFactorMutation,
  useSetupTwoFactorMutation,
} from "@/services/api/authApi";
import { useAuthSession } from "@/hooks/useAuthSession";
import type { TwoFactorSetupResult } from "@/types/api";

type TwoFactorSecurityCardProps = {
  enabled?: boolean;
};

type DialogMode = "enable" | "disable";

export function TwoFactorSecurityCard({ enabled }: TwoFactorSecurityCardProps) {
  const { logout } = useAuthSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>(enabled ? "disable" : "enable");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [setupResult, setSetupResult] = useState<TwoFactorSetupResult | null>(null);
  const [setupTwoFactor, { isLoading: isSettingUp }] = useSetupTwoFactorMutation();
  const [enableTwoFactor, { isLoading: isEnabling }] = useEnableTwoFactorMutation();
  const [disableTwoFactor, { isLoading: isDisabling }] = useDisableTwoFactorMutation();

  const resetDialogState = () => {
    setCode("");
    setCodeError("");
  };

  const openEnableDialog = async () => {
    setMode("enable");
    resetDialogState();
    setOpen(true);

    try {
      const result = await setupTwoFactor().unwrap();
      setSetupResult(result.data);
    } catch (error) {
      setOpen(false);
      toast({
        variant: "destructive",
        title: "Không thể tạo cấu hình xác minh 2 bước",
        description: extractApiErrorMessage(error, "Vui lòng thử lại sau."),
      });
    }
  };

  const openDisableDialog = () => {
    setMode("disable");
    resetDialogState();
    setOpen(true);
  };

  const handleToggle = () => {
    if (enabled) {
      openDisableDialog();
    } else {
      openEnableDialog();
    }
  };

  const submitCode = async () => {
    const normalizedCode = code.replace(/\D/g, "").slice(0, 6);
    if (normalizedCode.length !== 6) {
      setCodeError("Mã xác thực gồm 6 chữ số");
      return;
    }

    try {
      if (mode === "disable") {
        await disableTwoFactor({ code: normalizedCode }).unwrap();
        toast({
          variant: "success",
          title: "Đã tắt xác minh 2 bước",
          description: "Vui lòng đăng nhập lại để tiếp tục sử dụng tài khoản.",
        });
      } else {
        await enableTwoFactor({ code: normalizedCode }).unwrap();
        toast({
          variant: "success",
          title: "Đã bật xác minh 2 bước",
          description: "Vui lòng đăng nhập lại để tiếp tục sử dụng tài khoản.",
        });
      }

      logout();
    } catch (error) {
      toast({
        variant: "destructive",
        title: mode === "disable" ? "Không thể tắt xác minh 2 bước" : "Không thể bật xác minh 2 bước",
        description: extractApiErrorMessage(error, "Mã xác thực không đúng hoặc đã hết hạn."),
      });
    }
  };

  const isSubmitting = isSettingUp || isEnabling || isDisabling;
  const isEnableMode = mode === "enable";

  return (
    <>
      <Card className="self-start bg-surface-1 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand" />
            Xác minh 2 bước
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border-strong/70 bg-surface-0/80 px-4 py-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Trạng thái</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{enabled ? "Đang bật" : "Chưa bật"}</p>
            </div>
            <Switch
              checked={Boolean(enabled)}
              disabled={isSubmitting}
              onCheckedChange={handleToggle}
              aria-label={enabled ? "Tắt xác minh 2 bước" : "Bật xác minh 2 bước"}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetDialogState();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEnableMode ? "Bật xác minh 2 bước" : "Tắt xác minh 2 bước"}</DialogTitle>
            <DialogDescription>
              {isEnableMode
                ? "Quét mã QR bằng ứng dụng Authenticator, sau đó nhập mã 6 số."
                : "Nhập mã 6 số hiện tại từ ứng dụng Authenticator để tắt xác minh."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isEnableMode ? (
              <div className="rounded-lg border border-border-strong/70 bg-surface-0/80 p-4">
                {setupResult ? (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <QRCode
                        value={setupResult.otpauthUrl}
                        title={`QR xác minh 2 bước ${setupResult.accountName}`}
                        className="rounded-lg border border-border-strong"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Manual key</p>
                      <p className="mt-1 break-all font-geist-mono text-sm text-foreground">{setupResult.manualEntryKey}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">Đang tạo mã QR...</p>
                )}
              </div>
            ) : null}

            <div className="space-y-2">
              <SixDigitCodeInput
                idPrefix={isEnableMode ? "enableTwoFactorCode" : "disableTwoFactorCode"}
                value={code}
                onChange={(value) => {
                  setCode(value);
                  if (codeError) setCodeError("");
                }}
                disabled={isSubmitting}
              />
              {codeError ? <p className="text-center text-xs text-red-400">{codeError}</p> : null}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="button"
              variant={isEnableMode ? "default" : "destructive"}
              onClick={submitCode}
              disabled={isSubmitting || (isEnableMode && !setupResult)}
            >
              {isEnableMode ? (isEnabling ? "Đang bật..." : "Bật xác minh") : isDisabling ? "Đang tắt..." : "Tắt xác minh"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
