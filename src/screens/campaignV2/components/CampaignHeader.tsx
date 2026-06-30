"use client";

import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useGetGroupsQuery } from "@/services/api/groupsApi";

interface Props {
  hasNoCampaigns: boolean;
  onCreateClick: () => void;
}

const allGroupsValue = "__all";

export default function CampaignHeader({ hasNoCampaigns, onCreateClick }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: groupsData, isLoading: isGroupsLoading } = useGetGroupsQuery({
    page: 1,
    limit: 100,
  });

  const groups = groupsData?.items ?? [];
  const requestedGroupId = searchParams.get("telegramGroupId");
  const selectedGroup = groups.find((group) => group.id === requestedGroupId) ?? null;
  const selectedGroupId = selectedGroup?.id ?? allGroupsValue;
  const selectedGroupLabel = isGroupsLoading
    ? "Đang tải..."
    : selectedGroup?.title ?? (groups.length ? "Tất cả" : "Chưa có nhóm");

  const handleGroupChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === allGroupsValue) {
      params.delete("telegramGroupId");
    } else {
      params.set("telegramGroupId", value);
    }

    params.delete("campaignId");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 mb-6 justify-between sm:flex-row sm:items-end">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight mb-0.5 text-foreground">
          Chiến dịch đang diễn ra
        </h1>
        <p className="text-[14px] text-muted-foreground">
          Leaderboard real-time - có lớp chống gian lận (integrity)
        </p>
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-end">
        <Select
          value={selectedGroupId}
          onValueChange={handleGroupChange}
          disabled={isGroupsLoading}
        >
          <SelectTrigger
            aria-label="Chọn nhóm"
            className="h-10 w-full min-w-0 max-w-full overflow-hidden rounded-lg border-border bg-surface-2 text-foreground sm:w-[260px]"
            title={selectedGroup?.title ?? "Tất cả"}
          >
            <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
              <span className="shrink-0 text-muted-foreground">Đang xem nhóm:</span>
              <span className="block min-w-0 max-w-[118px] truncate font-medium sm:max-w-[100px]">
                {selectedGroupLabel}
              </span>
            </span>
          </SelectTrigger>
          <SelectContent className="max-h-[200px] max-w-[280px] border-border bg-surface-2 text-foreground">
            <SelectItem value={allGroupsValue}>
              <span className="block max-w-[220px] truncate">Tất cả</span>
            </SelectItem>
            {isGroupsLoading ? (
              <SelectItem value="__loading" disabled>
                Đang tải...
              </SelectItem>
            ) : groups.length ? (
              groups.map((group) => (
                <SelectItem key={group.id} value={group.id} title={group.title} className="max-w-[260px]">
                  <span className="block min-w-0 max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {group.title}
                  </span>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="__empty" disabled>
                Chưa có nhóm
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {!hasNoCampaigns && (
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[14px] font-semibold text-black transition-all hover:bg-brand-bright active:scale-[0.98] sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            Tạo campaign
          </button>
        )}
      </div>
    </div>
  );
}
