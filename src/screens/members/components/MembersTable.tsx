"use client";

import { useEffect, useMemo } from "react";
import { ArrowDown } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/dataTable";
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import type { ActiveFilterChip, SelectFilterConfig } from "@/components/filters/TableFilterBar";
import { toast } from "@/hooks/useToast";
import { useGetMembersQuery } from "@/services/api/membersApi";
import { extractApiErrorMessage } from "@/services/api/baseApi";
import type { MemberItem } from "@/types/api";
import MembersFilters from "./filter/MembersFilters";
import { useMembersFilters } from "../hooks/useMembersFilters";

function fullName(member: MemberItem) {
  return `${member.telegramFirstName ?? ""} ${member.telegramLastName ?? ""}`.trim() || member.telegramUsername;
}

function initials(member: MemberItem) {
  const source = fullName(member);
  const parts = source.split(" ").filter(Boolean);
  if (parts.length === 0) return "NA";
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(dateIso: string) {
  if (!dateIso) return "—";
  const date = new Date(dateIso);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("vi-VN");
}

function formatUsdVolume(value: string) {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) return value || "$0";

  return parsed.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function statusClass(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-success/[0.12] text-success border border-success/20";
    case "inactive":
      return "bg-muted/[0.12] text-muted-foreground border border-muted/20";
    default:
      return "bg-warning/[0.12] text-warning border border-warning/20";
  }
}

function formatLpexUserStatusValue(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "Hoạt động";
    case "inactive":
      return "Không hoạt động";
    default:
      return "Không xác định";
  }
}

function formatTelegramMembershipState(status: string | null | undefined) {
  const normalizedStatus = normalizeStatus(status);
  const option = TELEGRAM_STATUS.find((item) => item.value === normalizedStatus);
  return option?.label ?? "Không xác định";
}

function normalizeStatus(value: string | null | undefined) {
  return (value ?? "UNKNOWN").trim().toUpperCase();
}

const TELEGRAM_STATUS = [
  { value: "ACTIVE", label: "Đang tham gia" },
  { value: "INACTIVE", label: "Đã rời" },
];

const LPEX_USER_STATUS = [
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Không hoạt động" },
];

// const ELIGIBILITY_OPTIONS = [
//   { value: "ELIGIBLE", label: "Đủ điều kiện" },
//   { value: "WARNING", label: "Cảnh báo" },
//   { value: "FINAL_WARNING", label: "Cảnh báo cuối cùng" },
//   { value: "KICKED", label: "Đã bị loại" },
//   { value: "BLOCKED_REJOIN", label: "Bị chặn tham gia lại" },
//   { value: "PENDING_VERIFICATION", label: "Đang chờ xác minh" },
//   { value: "MANUAL_HOLD", label: "Tạm giữ thủ công" }
// ];

export default function MembersTable() {
  countries.registerLocale(enLocale)
  const {
    page,
    limit,
    searchInput,
    countryCodeInput,
    telegramStatusFilter,
    lpexUserStatusFilter,
    query,
    setPage,
    setLimit,
    setSearchInput,
    setCountryCodeInput,
    setTelegramStatusFilter,
    setLpexUserStatusFilter,
  } = useMembersFilters();

  const { data, isLoading, isFetching, error } = useGetMembersQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!error) return;

    toast({
      variant: "destructive",
      title: "Không tải được danh sách member",
      description: extractApiErrorMessage(error, "Đã có lỗi xảy ra khi gọi API /kol/members"),
    });
  }, [error]);

  const members = data?.items ?? [];
  const pagination = data?.pagination;
  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, setPage, totalPages]);

  const startIndex = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = totalItems === 0 ? 0 : Math.min(page * limit, totalItems);

  const selectFilters: SelectFilterConfig[] = useMemo(
    () => [
      {
        key: "telegramStatus",
        label: "Trạng thái telegram",
        options: TELEGRAM_STATUS,
      },
      {
        key: "lpexUserStatus",
        label: "Trạng thái LPEX",
        options: LPEX_USER_STATUS,
      },
      // {
      //   key: "eligibilityStatus",
      //   label: "Điều kiện",
      //   options: ELIGIBILITY_OPTIONS,
      // }
    ],
    [],
  );

  const activeFilterChips = useMemo(() => {
    const chips: ActiveFilterChip[] = [];

    for (const filter of selectFilters) {
      const selectedValue =
        filter.key === "telegramStatus" ? telegramStatusFilter : lpexUserStatusFilter;
      if (!selectedValue) continue;

      const selectedOption = filter.options.find((option) => option.value === selectedValue);
      if (!selectedOption) continue;

      chips.push({
        key: filter.key,
        label: filter.label,
        valueLabel: selectedOption.label,
      });
    }

    return chips;
  }, [lpexUserStatusFilter, selectFilters, telegramStatusFilter]);

  const columns: DataTableColumn<MemberItem>[] = [
    {
      id: "member",
      header: "Member",
      cell: (member) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8B84D] to-[#A86B3F] grid place-items-center text-xs font-semibold text-foreground shrink-0">
            {initials(member)}
          </div>
          <div>
            <div className="text-[13.5px] font-medium">{fullName(member)}</div>
            <div className="text-[11px] text-muted-foreground font-geist-mono">
              @{member.telegramUsername} · TG ID {member.telegramUserId}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "lpexUid",
      header: "UID",
      cell: (member) => <span className="font-geist-mono">{member.lpexUid || "—"}</span>,
    },
    // {
    //   id: "country",
    //   header: "Country",
    //   cell: (member) => {
    //     const code = (member.countryCode || "").trim().toUpperCase();
    //     if (!code) return <span>—</span>;

    //     const countryName = countries.getName(code, "en") || code;

    //     return (
    //       <span className="inline-flex items-center gap-1.5">
    //         <span>{countryName} ({code})</span>
    //         <ReactCountryFlag
    //           countryCode={code}
    //           svg
    //           style={{ width: "1em", height: "1em" }}
    //           aria-label={countryName}
    //         />
    //       </span>
    //     );
    //   },
    // },
    {
      id: "groups",
      header: "Groups",
      cell: (member) => {
        const groups = member.eligibleGroups || [];
        if (groups.length === 0) {
          return <span className="text-muted-foreground">—</span>;
        }

        return (
          <div className="flex flex-col gap-1 items-start">
            {groups.map((group: any, idx: number) => {
              const fullTitle = group.title || "";
              const displayTitle = fullTitle.length > 15 ? fullTitle.substring(0, 15) + "..." : fullTitle;
              
              return (
                <div key={idx} className="flex items-center text-[12.5px] cursor-help" title={fullTitle}>
                  <span className="mr-1.5 text-muted-foreground">-</span>
                  <span className="font-medium">{displayTitle}</span>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      id: "volume",
      header: (
        <span className="inline-flex items-center gap-1">
          <span>Volume 30D</span>
          <ArrowDown className="w-3 h-3 shrink-0" aria-hidden="true" />
        </span>
      ),
      cellClassName: "font-geist-mono font-medium",
      cell: (member) => formatUsdVolume(member.usdVolume),
    },
    {
      id: "status",
      header: "Trạng thái LPEX",
      cell: (member) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11.5px] font-medium ${statusClass(
            member.lpexUserStatus || "unknown",
          )}`}
        >
          {formatLpexUserStatusValue(member.lpexUserStatus || "unknown")}
        </span>
      ),
    },
    {
      id: "telegramStatus",
      header: "Trạng thái telegram",
      cell: (member) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11.5px] font-medium ${statusClass(
            member.telegramStatus || "unknown",
          )}`}
        >
          {formatTelegramMembershipState(member.telegramStatus)}
        </span>
      ),
    },
    {
      id: "registeredAt",
      header: "Ngày đăng ký",
      cell: (member) => formatDate(member.registeredAtLpex || member.createdAt),
    },
  ];

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] overflow-visible relative">
        <MembersFilters
        searchInput={searchInput}
        countryCodeInput={countryCodeInput}
        isFetching={isFetching}
        selectFilters={selectFilters}
        activeFilterChips={activeFilterChips}
        onSearchInputChange={(value) => {
          setSearchInput(value);
        }}
        onCountryCodeInputChange={(value) => {
          setCountryCodeInput(value);
        }}
        onSelectFilter={(key, value) => {
          if (key === "telegramStatus") {
            setTelegramStatusFilter(value);
            return;
          }

          if (key === "lpexUserStatus") {
            setLpexUserStatusFilter(value);
          }
        }}
        onRemoveChip={(key) => {
          if (key === "telegramStatus") {
            setTelegramStatusFilter("");
            return;
          }

          if (key === "lpexUserStatus") {
            setLpexUserStatusFilter("");
          }
        }}
      />

      <div className="rounded-b-[14px] overflow-hidden">
        <DataTable
          columns={columns}
          data={members}
          rowKey={(member) => member.id}
          isLoading={isLoading}
          loadingContent="Đang tải danh sách members..."
          emptyContent="Không có member phù hợp với bộ lọc"
          className="border-none rounded-none"
          pagination={{
            page,
            totalPages,
            totalItems,
            limit,
            onPageChange: (nextPage) => setPage(nextPage),
            onLimitChange: (nextLimit) => {
              setLimit(nextLimit);
            },
            limitOptions: [10, 20, 50],
            isDisabled: isFetching,
            summaryText:
              totalItems > 0
                ? `Hiển thị ${startIndex}-${endIndex} / ${totalItems} members`
                : "Chưa có dữ liệu member",
          }}
        />
      </div>
    </div>
  );
}
