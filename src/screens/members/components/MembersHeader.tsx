"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import { toast } from "@/hooks/useToast";
import { extractApiErrorMessage } from "@/services/api/baseApi";
import { useLazyGetMembersQuery } from "@/services/api/membersApi";
import type { ListMembersQuery, MemberItem } from "@/types/api";

function fullName(member: MemberItem) {
  return `${member.telegramFirstName ?? ""} ${member.telegramLastName ?? ""}`.trim() || member.telegramUsername || "";
}

function fakeGroups(member: MemberItem) {
  const pool = [
    ["V", "B", "Đ"],
    ["V", "Đ"],
    ["B", "Đ"],
    ["Đ"],
    [],
  ] as const;
  const keySource = member.id || member.telegramUserId || member.lpexUid || "0";
  const numericSeed = keySource.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return pool[numericSeed % pool.length].join("|");
}

function toWorkbook(members: MemberItem[]) {
  const rows = members.map((member) => ({
    id: member.id,
    name: fullName(member),
    telegramUsername: member.telegramUsername ?? "",
    telegramUserId: member.telegramUserId ?? "",
    lpexUid: member.lpexUid ?? "",
    countryCode: member.countryCode ?? "",
    usdVolume: member.usdVolume ?? "",
    lpexUserStatus: member.lpexUserStatus ?? "",
    telegramStatus: member.telegramStatus ?? "",
    registeredAtLpex: member.registeredAtLpex ?? "",
    groups: fakeGroups(member),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
  return workbook;
}

function workbookToBlob(workbook: XLSX.WorkBook) {
  const data = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const arrayBuffer = data instanceof ArrayBuffer ? data : new Uint8Array(data).buffer;
  return new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

async function saveBlobWithPicker(blob: Blob, fileName: string) {
  const win = window as Window & {
    showSaveFilePicker?: (options: {
      suggestedName: string;
      types: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<{
      createWritable: () => Promise<{
        write: (data: Blob) => Promise<void>;
        close: () => Promise<void>;
      }>;
    }>;
  };

  if (!win.showSaveFilePicker) {
    return false;
  }

  const handle = await win.showSaveFilePicker({
    suggestedName: fileName,
    types: [
      {
        description: "Excel Workbook",
        accept: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        },
      },
    ],
  });

  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
  return true;
}

function fallbackBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.setAttribute("download", fileName);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function MembersHeader() {
  const searchParams = useSearchParams();
  const [triggerGetMembers, { isFetching }] = useLazyGetMembersQuery();

  const queryFromUrl = useMemo<ListMembersQuery>(
    () => ({
      page: Math.max(1, Number(searchParams.get("page") || "1") || 1),
      limit: Math.min(100, Math.max(1, Number(searchParams.get("limit") || "20") || 20)),
      search: searchParams.get("search")?.trim() || undefined,
      countryCode: searchParams.get("countryCode")?.trim().toUpperCase() || undefined,
      groupId: searchParams.get("groupId")?.trim() || undefined,
      eligibilityStatus: searchParams.get("eligibilityStatus")?.trim().toUpperCase() || undefined,
      membershipState: searchParams.get("membershipState")?.trim().toUpperCase() || undefined,
      includeGroups:
        searchParams.get("includeGroups") === "1" || searchParams.get("includeGroups") === "true"
          ? true
          : searchParams.get("includeGroups") === "0" || searchParams.get("includeGroups") === "false"
            ? false
            : undefined,
    }),
    [searchParams],
  );

  const handleExportExcel = async () => {
    try {
      const firstPageQuery: ListMembersQuery = {
        ...queryFromUrl,
        page: 1,
        limit: 100,
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

      const workbook = toWorkbook(allItems);
      const blob = workbookToBlob(workbook);
      const now = new Date();
      const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
      const fileName = `members_${stamp}.xlsx`;

      const savedByPicker = await saveBlobWithPicker(blob, fileName);

      if (savedByPicker) {
        toast({
          title: "Export Excel thành công",
          description: `Đã lưu ${allItems.length} members`,
        });
        return;
      }

      fallbackBrowserDownload(blob, fileName);

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

  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight mb-0.5">Cộng đồng / Members</h1>
        <div className="text-[13px] text-muted-foreground">
          Quản lý và theo dõi tất cả members trên các groups
        </div>
      </div>
      <div className="flex gap-2">
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
        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold bg-brand text-primary-foreground hover:bg-brand-dim transition-all">
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
          Mời member
        </button>
      </div>
    </div>
  );
}
