"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { DataTable, type DataTableColumn } from "@/components/ui/dataTable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import type { ActiveFilterChip, SelectFilterConfig } from "@/components/filters/TableFilterBar";
import { toast } from "@/hooks/useToast";
import { useGetMembersQuery } from "@/services/api/membersApi";
import { extractApiErrorMessage } from "@/services/api/baseApi";
import type { MemberItem } from "@/types/api";
import { GroupLogoBadge } from "@/screens/groups/components/groupLogoBadge";
import MembersFilters from "./filter/MembersFilters";
import { useMembersFilters } from "../hooks/useMembersFilters";

function fullName(member: MemberItem) {
  return `${member.telegramFirstName ?? ""} ${member.telegramLastName ?? ""}`.trim() || member.telegramUsername;
}

function formatDate(dateIso: string) {
  if (!dateIso) return "—";
  const date = new Date(dateIso);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("vi-VN");
}

function formatVndVolume(value: string) {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) return value || "0 VNĐ";

  return `${Math.round(parsed).toLocaleString("vi-VN")} VNĐ`;
}

function truncateGroupTitle(title: string | null | undefined, maxLength = 10) {
  const normalizedTitle = (title || "—").trim() || "—";
  return normalizedTitle.slice(0, maxLength);
}

function statusClass(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-success/[0.12] text-success border border-success/20";
    case "inactive":
      return "bg-[#2B2B2B] text-[#B7B7B7] border border-[#3A3A3A]";
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

function getMemberProgressConfig(status: MemberItem["memberProgressStatus"]) {
  switch (status) {
    case "KYC_COMPLETED":
      return { label: "Đã KYC", steps: 2, labelClassName: "text-[#12B76A]", textClassName: "text-base" };
    case "DEPOSIT_COMPLETED":
      return { label: "Đã deposit", steps: 3, labelClassName: "text-[#FFD000]", textClassName: "text-base" };
    case "TRADE_COMPLETED":
      return { label: "Đã giao dịch", steps: 4, labelClassName: "text-[#00A4FF]", textClassName: "text-base" };
    case "NOT_KYC":
    default:
      return { label: "Chưa KYC", steps: 1, labelClassName: "text-[#A8A8A9]", textClassName: "text-base" };
  }
}

const LPEX_USER_STATUS = [
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Không hoạt động" },
];

const MEMBER_TYPE_TABS = [
  { value: "all", label: "Tất cả" },
  { value: "inactive_2_weeks", label: "Không hoạt động 2 tuần" },
  { value: "warning", label: "Bị cảnh báo" },
] as const;

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
  const [activeMemberType, setActiveMemberType] = useState<(typeof MEMBER_TYPE_TABS)[number]["value"]>("all");
  const {
    page,
    limit,
    searchInput,
    countryCodeInput,
    lpexUserStatusFilter,
    eligibilityStatusFilter,
    inactiveDaysFilter,
    query,
    sortBy,
    sortOrder,
    setPage,
    setLimit,
    setSort,
    setSearchInput,
    setCountryCodeInput,
    setLpexUserStatusFilter,
    setMemberTypeFilter,
  } = useMembersFilters();

  const warningEligibilityStatuses = eligibilityStatusFilter.split(",");
  const selectedMemberType =
    warningEligibilityStatuses.includes("FINAL_WARNING") || warningEligibilityStatuses.includes("WARNING")
      ? "warning"
      : inactiveDaysFilter === 14
        ? "inactive_2_weeks"
        : activeMemberType;

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
        key: "lpexUserStatus",
        label: "Trạng thái",
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
      const selectedValue = lpexUserStatusFilter;
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
  }, [lpexUserStatusFilter, selectFilters]);

  const renderSortableHeader = (
    title: string,
    field: "telegramUsername" | "usdVolume" | "createdAt",
  ) => {
    const isActive = sortBy === field;

    return (
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        onClick={() => setSort(field, isActive && sortOrder === "asc" ? "desc" : "asc")}
      >
        <span>{title}</span>
        <Image
          src="/images/icons/arrow_up_down_icon.svg"
          alt=""
          width={8}
          height={12}
          aria-hidden="true"
          className={`h-3 w-2 shrink-0 ${isActive ? "opacity-100" : "opacity-70"}`}
        />
      </button>
    );
  };

  const columns: DataTableColumn<MemberItem>[] = [
    {
      id: "member",
      header: "Thành viên",
      cell: (member) => (
        <div className="flex items-center gap-3">
          <Image
            src="/images/avatar_default.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div>
            <div className="text-base font-normal leading-6 text-white">{fullName(member)}</div>
            <div className="text-sm text-muted-foreground">
              @{member.telegramUsername}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "groups",
      header: "Groups",
      cell: (member) => {
        const groups = member.eligibleGroups || [];
        const visibleGroups = groups.slice(0, 3);

        if (groups.length === 0) {
          return <span className="text-base text-muted-foreground">—</span>;
        }

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="inline-flex items-center gap-1.5">
                {visibleGroups.map((group) => (
                  <GroupLogoBadge
                    key={group.accessId || group.groupId}
                    iconKey={group.iconKey}
                    title={group.title}
                    className="h-5 w-6"
                    textClassName="text-[10px]"
                  />
                ))}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="start"
              className="rounded-lg border-[#303030] bg-[#1F1F1F] px-2.5 py-2 shadow-xl"
            >
              <div className="space-y-1.5">
                {groups.map((group) => (
                  <div key={group.accessId || group.groupId} className="flex items-center gap-2">
                    <GroupLogoBadge
                      iconKey={group.iconKey}
                      title={group.title}
                      className="h-5 w-6"
                      textClassName="text-[10px]"
                    />
                    <span className="max-w-[96px] text-sm font-medium text-foreground">
                      {truncateGroupTitle(group.title)}
                    </span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    // {
    //   id: "lpexUid",
    //   header: "UID",
    //   cell: (member) => <span className="font-geist-mono">{member.lpexUid || "—"}</span>,
    // },
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
      id: "volume",
      header: renderSortableHeader("Volume 30D", "usdVolume"),
      cellClassName: "font-medium text-base",
      cell: (member) => formatVndVolume(member.usdVolume),
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: (member) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-xs font-normal ${statusClass(
            member.lpexUserStatus || "unknown",
          )}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
          {formatLpexUserStatusValue(member.lpexUserStatus || "unknown")}
        </span>
      ),
    },
    {
      id: "verification",
      header: "Xác minh",
      cell: (member) => {
        const progress = getMemberProgressConfig(member.memberProgressStatus);

        return (
          <div className="inline-flex min-w-[116px] flex-col items-start gap-2 text-left">
            <span className={`text-xs font-normal leading-tight ${progress.labelClassName}`}>
              {progress.label}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={`h-1 w-6 rounded-full ${step <= progress.steps ? "bg-[#16C784]" : "bg-[#2A2A2A]"}`}
                />
              ))}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-[#171717] border border-border rounded-[14px] overflow-visible relative">
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
          if (key === "lpexUserStatus") {
            setLpexUserStatusFilter(value);
          }
        }}
        onRemoveChip={(key) => {
          if (key === "lpexUserStatus") {
            setLpexUserStatusFilter("");
          }
        }}
      />

      <div className="border-b border-[#303030] px-6">
        <div className="scrollbar-none flex items-end gap-7 overflow-x-auto">
          {MEMBER_TYPE_TABS.map((tab) => {
            const isActive = selectedMemberType === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                className={`relative inline-flex shrink-0 items-center justify-center gap-2 pb-3 text-sm font-medium leading-5 transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setActiveMemberType(tab.value);
                  setMemberTypeFilter(tab.value);
                }}
              >
                <span>{tab.label}</span>
                {/* {"count" in tab ? (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-normal text-primary-foreground">
                    {tab.count}
                  </span>
                ) : null} */}
                {isActive ? (
                  <span className="absolute -bottom-px left-1/2 h-0.5 w-[calc(100%+16px)] -translate-x-1/2 rounded-full bg-white" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-b-[14px] overflow-hidden">
        <DataTable
          columns={columns}
          data={members}
          rowKey={(member) => member.id}
          isLoading={isLoading}
          loadingContent="Đang tải danh sách members..."
          emptyContent="Không có member phù hợp với bộ lọc"
          className="border-none rounded-none [&_.data-table-scroll-viewport]:scrollbar-none [&_.data-table-scroll-viewport]:border-t-0"
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
                ? `Hiển thị ${startIndex}-${endIndex} / ${totalItems}`
                : "Chưa có dữ liệu member",
          }}
        />
      </div>
    </div>
  );
}
