"use client";

import { useEffect, useMemo } from "react";
import { ArrowDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { DataTable, type DataTableColumn } from "@/components/ui/dataTable";
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import type { ActiveFilterChip, SelectFilterConfig } from "@/components/filters/TableFilterBar";
import { toast } from "@/hooks/useToast";
import { useUrlFilterState } from "@/hooks/useUrlFilterState";
import { useGetMembersQuery } from "@/services/api/membersApi";
import { extractApiErrorMessage } from "@/services/api/baseApi";
import type { ListMembersQuery, MemberItem } from "@/types/api";
import MembersFilters from "./filter/MembersFilters";

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
    case "verified":
      return "bg-success/[0.12] text-success border border-success/20";
    case "disabled":
    case "pending":
      return "bg-warning/[0.12] text-warning border border-warning/20";
    case "banned":
    case "blocked":
      return "bg-destructive/[0.12] text-destructive border border-destructive/20";
    case "unknown":
      return "bg-muted/[0.12] text-muted-foreground border border-muted/20";
    default:
      return "bg-info/[0.12] text-info border border-info/20";
  }
}

function formatLpexUserStatusValue(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "Hoạt động";
    case "disabled":
      return "Vô hiệu hoá";
    case "banned":
      return "Đã cấm";
    case "unknown":
      return "Không rõ";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function formatTelegramMembershipState(status: string | null | undefined) {
  const normalizedStatus = normalizeStatus(status);
  const option = MEMBERSHIP_STATE_OPTIONS.find((item) => item.value === normalizedStatus);
  return option?.label ?? normalizedStatus;
}

function normalizeStatus(value: string | null | undefined) {
  return (value ?? "UNKNOWN").trim().toUpperCase();
}

function statusTone(status: string): "warning" | "info" | "danger" | "neutral" {
  if (status.includes("KICK") || status.includes("BLOCK")) {
    return "danger";
  }

  if (status.includes("PENDING") || status.includes("WAIT") || status.includes("VERIFY")) {
    return "warning";
  }

  if (status.includes("LEFT")) {
    return "neutral";
  }

  return "info";
}


const MEMBERSHIP_STATE_OPTIONS = [
  { value: "UNKNOWN", label: "Không xác định" },
  { value: "ACTIVE", label: "Đang tham gia" },
  { value: "LEFT", label: "Đã rời nhóm" },
  { value: "KICKED", label: "Đã bị kick" },
  { value: "BANNED", label: "Đã bị cấm" },
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
  const { values, draftValues, setFilter, setMany, clearFilter } = useUrlFilterState({
    initialValues: {
      page: "1",
      limit: "20",
      search: "",
      countryCode: "",
      groupId: "",
      membershipState: "",
      eligibilityStatus: "",
      includeGroups: "",
    },
    debounceKeys: ["search", "countryCode"],
    debounceMs: 500,
  });

  const page = Math.max(1, Number(values.page || "1") || 1);
  const limit = Math.min(100, Math.max(10, Number(values.limit || "20") || 20));

  const query: ListMembersQuery = useMemo(
    () => ({
      page,
      limit,
      search: values.search.trim() || undefined,
      countryCode: values.countryCode.trim().toUpperCase() || undefined,
      groupId: values.groupId || undefined,
      membershipState: values.membershipState || undefined,
      eligibilityStatus: values.eligibilityStatus || undefined,
      includeGroups: true,
    }),
    [limit, page, values.countryCode, values.eligibilityStatus, values.groupId, values.membershipState, values.search],
  );

  const { data, isLoading, isFetching, error } = useGetMembersQuery(query);

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
      setFilter("page", String(totalPages), { immediate: true });
    }
  }, [page, setFilter, totalPages]);

  const startIndex = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = totalItems === 0 ? 0 : Math.min(page * limit, totalItems);

  const statusBadges = useMemo(() => {
    const counter = new Map<string, number>();

    for (const member of members) {
      const lpexStatus = normalizeStatus(member.lpexUserStatus);
      if (lpexStatus !== "ACTIVE") {
        counter.set(lpexStatus, (counter.get(lpexStatus) ?? 0) + 1);
      }
    }

    return Array.from(counter.entries())
      .map(([status, count]) => ({
        key: status,
        label: formatLpexUserStatusValue(status),
        count,
        tone: statusTone(status),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [members]);

  const selectFilters: SelectFilterConfig[] = useMemo(
    () => [
      {
        key: "membershipState",
        label: "Trạng thái telegram",
        options: MEMBERSHIP_STATE_OPTIONS,
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
      const selectedValue = values[filter.key as keyof typeof values];
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
  }, [selectFilters, values]);

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
      header: "Trạng thái",
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
        searchInput={draftValues.search}
        countryCodeInput={draftValues.countryCode}
        isFetching={isFetching}
        selectFilters={selectFilters}
        activeFilterChips={activeFilterChips}
        onSearchInputChange={(value) => {
          setMany({ search: value, page: "1" });
        }}
        onCountryCodeInputChange={(value) => {
          setMany({ countryCode: value, page: "1" });
        }}
        onSelectFilter={(key, value) => {
          setMany({ [key]: value, page: "1" }, { immediate: true });
        }}
        onRemoveChip={(key) => {
          clearFilter(key as keyof typeof values, { immediate: true });
          setFilter("page", "1", { immediate: true });
        }}
        statusBadges={statusBadges}
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
            onPageChange: (nextPage) => setFilter("page", String(nextPage), { immediate: true }),
            onLimitChange: (nextLimit) => {
              setMany({ limit: String(nextLimit), page: "1" }, { immediate: true });
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
