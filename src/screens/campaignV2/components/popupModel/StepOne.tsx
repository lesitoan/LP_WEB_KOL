import { useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { useGetGroupsQuery } from "@/services/api/groupsApi";
import FormInput from "./FormInput";
import DateTimePicker from "./DateTimePicker";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import type { CampaignFormValues } from "./schema";
import { RANKING_TYPE_OPTIONS } from "./schema";

interface StepOneProps {
  mode?: "create" | "edit";
}

function isActiveGroupStatus(status?: string | null) {
  return status === "ACTIVE" || status === "active";
}

export default function StepOne({ mode = "create" }: StepOneProps) {
  const {
    register,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext<CampaignFormValues>();
  const { data: groupsData, isLoading: isGroupsLoading } = useGetGroupsQuery({
    page: 1,
    limit: 100,
  });

  const startAtVal = watch("startAt");
  const telegramGroupId = watch("telegramGroupId");
  const nowStr = (() => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  })();

  const minStartAt = mode === "create" ? nowStr : undefined;
  const minEndAt = startAtVal && startAtVal > nowStr ? startAtVal : nowStr;

  useEffect(() => {
    if (telegramGroupId) {
      clearErrors("telegramGroupId");
    }
  }, [clearErrors, telegramGroupId]);

  const loadedGroupOptions = (groupsData?.items ?? [])
    .filter((group) => isActiveGroupStatus(group.status))
    .map((group) => ({
      label: group.title,
      value: group.id,
    }));
  const hasSelectedGroupOption = loadedGroupOptions.some(
    (option) => option.value === telegramGroupId,
  );
  const groupOptions = [
    { label: "Toàn bộ nhóm", value: "ALL_GROUPS" },
    ...loadedGroupOptions,
    ...(telegramGroupId && telegramGroupId !== "ALL_GROUPS" && !hasSelectedGroupOption
      ? [{ label: isGroupsLoading ? "Đang tải..." : telegramGroupId, value: telegramGroupId }]
      : []),
  ];
  const selectedGroupLabel = groupOptions.find((opt) => opt.value === telegramGroupId)?.label || "Chọn phạm vi";

  return (
    <div className="space-y-4">
      <FormInput
        label="Tên chiến dịch"
        placeholder="Nhập tên chiến dịch"
        {...register("name")}
        error={errors.name?.message}
      />
      <FormInput
        label="Mô tả chiến dịch"
        placeholder="Nhập mô tả cho chiến dịch"
        isTextarea
        {...register("description")}
        error={errors.description?.message}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Controller
          control={control}
          name="startAt"
          render={({ field }) => (
            <DateTimePicker
              label="Thời gian bắt đầu"
              placeholder="Chọn ngày giờ bắt đầu"
              icon={<CalendarDays className="h-4 w-4" />}
              min={minStartAt}
              value={field.value}
              onChange={field.onChange}
              error={errors.startAt?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="endAt"
          render={({ field }) => (
            <DateTimePicker
              label="Thời gian kết thúc"
              placeholder="Chọn ngày giờ kết thúc"
              icon={<CalendarDays className="h-4 w-4" />}
              min={minEndAt}
              value={field.value}
              onChange={field.onChange}
              error={errors.endAt?.message}
            />
          )}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] md:text-[14px] font-medium text-white/85">Tiêu chí xếp hạng</label>
          <Controller
            control={control}
            name="rankingType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full bg-[#111111] border border-white/10 rounded-[8px] text-[13px] md:text-[14px] font-normal text-white focus:border-[#F7F0A1]/70 h-10 px-3 py-2.5">
                  {RANKING_TYPE_OPTIONS.find((opt) => opt.value === field.value)?.label || "Chọn tiêu chí"}
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#171717] text-white z-[110]">
                  {RANKING_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.rankingType?.message && (
            <p className="mt-1 text-[11px] text-red-400">{errors.rankingType.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] md:text-[14px] font-medium text-white/85">Phạm vi áp dụng</label>
          <Controller
            control={control}
            name="telegramGroupId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isGroupsLoading}>
                  <SelectTrigger className="w-full min-w-0 bg-[#111111] border border-white/10 rounded-[8px] text-[13px] md:text-[14px] font-normal text-white focus:border-[#F7F0A1]/70 h-10 px-3 py-2.5">
                    <span className="block min-w-0 flex-1 truncate text-left" title={selectedGroupLabel}>
                      {selectedGroupLabel}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)] border-white/10 bg-[#171717] text-white z-[110] max-h-[200px]">
                    {groupOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} title={opt.label}>
                        <span
                          className="block overflow-hidden text-ellipsis whitespace-nowrap pr-4"
                          style={{ maxWidth: "calc(var(--radix-select-trigger-width) - 44px)" }}
                          title={opt.label}
                        >
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.telegramGroupId?.message && (
            <p className="mt-1 text-[11px] text-red-400">{errors.telegramGroupId.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
