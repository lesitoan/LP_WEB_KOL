"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Facebook, Send, Twitter, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/useToast";
import { extractApiErrorMessage } from "@/services/api/baseApi";
import { useGetCurrentUserQuery } from "@/services/api/authApi";
import { useLazyGetVolumePeriodsMembersQuery } from "@/services/api/membersApi";
import type { ListMembersQuery } from "@/types/api";
import { exportMembersToExcel } from "../utils/exportUtils";

export default function MembersHeader() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const [triggerGetMembers, { isFetching }] = useLazyGetVolumePeriodsMembersQuery();
  const { data: profile } = useGetCurrentUserQuery();

  const queryFromUrl = useMemo<ListMembersQuery>(() => {
    const inactiveDays = Number(searchParams.get("inactiveDays") || "");
    const sortByRaw = searchParams.get("sortBy")?.trim();
    const sortBy =
      sortByRaw === "telegramUsername" ||
      sortByRaw === "usdVolume" ||
      sortByRaw === "volume7d" ||
      sortByRaw === "volume30d" ||
      sortByRaw === "createdAt"
        ? sortByRaw
        : undefined;
    const sortOrderRaw = searchParams.get("sortOrder")?.trim();

    return {
      page: Math.max(1, Number(searchParams.get("page") || "1") || 1),
      limit: Math.min(100, Math.max(1, Number(searchParams.get("limit") || "20") || 20)),
      sortBy,
      sortOrder: sortOrderRaw === "asc" || sortOrderRaw === "desc" ? sortOrderRaw : undefined,
      search: searchParams.get("search")?.trim() || undefined,
      countryCode: searchParams.get("countryCode")?.trim().toUpperCase() || undefined,
      telegramStatus: searchParams.get("telegramStatus")?.trim() || undefined,
      lpexUserStatus: searchParams.get("lpexUserStatus")?.trim() || undefined,
      groupId: searchParams.get("groupId")?.trim() || undefined,
      eligibilityStatus: searchParams.get("eligibilityStatus")?.trim().toUpperCase() || undefined,
      inactiveDays: Number.isInteger(inactiveDays) && inactiveDays > 0 ? inactiveDays : undefined,
      membershipState: searchParams.get("membershipState")?.trim().toUpperCase() || undefined,
      includeGroups:
        searchParams.get("includeGroups") === "1" || searchParams.get("includeGroups") === "true"
          ? true
          : searchParams.get("includeGroups") === "0" || searchParams.get("includeGroups") === "false"
            ? false
            : undefined,
    };
  }, [searchParams]);

  const handleExportExcel = async () => {
    try {
      const firstPageQuery: ListMembersQuery = {
        ...queryFromUrl,
        page: 1,
        limit: 100,
        includeGroups: true,
      };

      const firstPageData = await triggerGetMembers(firstPageQuery).unwrap();
      let allItems = [...firstPageData.items];
      const totalPages = Math.max(1, firstPageData.pagination.totalPages || 1);

      if (totalPages > 1) {
        for (let page = 2; page <= totalPages; page += 1) {
          const pageData = await triggerGetMembers({ ...firstPageQuery, page }).unwrap();
          allItems = [...allItems, ...pageData.items];
        }
      }

      const savedByPicker = await exportMembersToExcel(allItems);

      if (savedByPicker) {
        toast({
          title: "Export Excel thành công",
          description: `Đã lưu ${allItems.length} members`,
        });
        return;
      }

      toast({
        title: "Đã tạo file Excel",
        description: "Trình duyệt đang xử lý tải xuống .xlsx",
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      toast({
        variant: "destructive",
        title: "Export Excel thất bại",
        description: extractApiErrorMessage(error, "Không thể export Excel lúc này"),
      });
    }
  };

  const referralCode = profile?.kolCode?.trim() || "";
  const referralBaseUrl = process.env.NEXT_PUBLIC_REFERRAL_BASE_URL?.trim() || "https://platform.com";
  const referralLink = referralCode ? `${referralBaseUrl.replace(/\/+$/, "")}/${referralCode}` : "";
  const encodedReferralLink = encodeURIComponent(referralLink);

  const handleCopyReferralLink = async () => {
    if (!referralLink) {
      toast({
        variant: "destructive",
        title: "Không tìm thấy mã mời",
        description: "Không thể tạo link mời vì thiếu partner.code",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Đã sao chép link",
        description: referralLink,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Không thể sao chép",
        description: "Vui lòng thử lại hoặc sao chép thủ công",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight mb-0.5">Cộng đồng</h1>
          <div className="text-sm font-normal text-muted-foreground">
            Quản lý và theo dõi tất cả members trên các groups
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 sm:ml-auto">
          <button
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium bg-surface-2 border border-border text-foreground hover:bg-surface-3 transition-all disabled:opacity-60"
            type="button"
            onClick={handleExportExcel}
            disabled={isFetching}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {isFetching ? "Đang export..." : "Export Excel"}
          </button>
          {/* <button
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold bg-brand text-primary-foreground hover:bg-brand-dim transition-all"
            type="button"
            onClick={() => setIsInviteDialogOpen(true)}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Mời thêm thành viên
          </button> */}
        </div>
      </div>
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-[560px] p-0 overflow-hidden" showCloseButton={false}>
          <DialogHeader className="border-b border-border px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="text-base font-semibold">Chia sẻ nhanh</DialogTitle>
              <button
                type="button"
                onClick={() => setIsInviteDialogOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Đóng popup</span>
              </button>
            </div>
          </DialogHeader>
          <div className="px-6 py-5 space-y-5">
            <div className="space-y-2">
              <label className="text-[13px] text-muted-foreground">Link giới thiệu của bạn</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={referralLink}
                  className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-[13px] text-foreground outline-none"
                  placeholder="Chưa có link mời"
                />
                <button
                  type="button"
                  onClick={handleCopyReferralLink}
                  className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-lg border border-border bg-surface-2 hover:bg-surface-3 disabled:opacity-60"
                  disabled={!referralLink}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Sao chép link</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[13px] text-muted-foreground">Chia sẻ lên mạng xã hội</p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://t.me/share/url?url=${encodedReferralLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-brand/35 bg-brand/15 px-3 py-1.5 text-[12.5px] font-medium text-brand hover:bg-brand/25"
                >
                  <Send className="h-3.5 w-3.5" />
                  Telegram
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedReferralLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-brand/35 bg-brand/15 px-3 py-1.5 text-[12.5px] font-medium text-brand hover:bg-brand/25"
                >
                  <Twitter className="h-3.5 w-3.5" />
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedReferralLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-brand/35 bg-brand/15 px-3 py-1.5 text-[12.5px] font-medium text-brand hover:bg-brand/25"
                >
                  <Facebook className="h-3.5 w-3.5" />
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
