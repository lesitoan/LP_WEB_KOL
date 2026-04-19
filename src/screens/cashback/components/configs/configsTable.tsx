"use client"

import { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { CashbackItemSkeleton } from "../../../../components/skeletons/CashbackItemSkeleton";
import TableFilterBar, {
  type ActiveFilterChip,
  type SelectFilterConfig,
} from "@/components/filters/TableFilterBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type {
  CashbackConfigData,
  DistributionCycle,
  GroupItem,
  UpdateCashbackConfigBody,
} from "@/types/api";
import {
  configStatusLabel,
  distributionCycleLabel,
  statusBadgeClass,
  toCurrency,
  toDateInputValue,
  toDateTime,
  type ConfigStatusFilter,
} from "../../constants";

type ConfigsTableProps = {
  configs: CashbackConfigData[];
  groups: GroupItem[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  isFetching: boolean;
  statusFilter: ConfigStatusFilter;
  isUpdating: boolean;
  onStatusFilterChange: (value: ConfigStatusFilter | "all") => void;
  onPageChange: (nextPage: number) => void;
  onToggleConfigStatus: (config: CashbackConfigData) => void;
  onPatchConfig: (config: CashbackConfigData, patch: UpdateCashbackConfigBody) => Promise<void>;
};

type ConfigItemCardProps = {
  config: CashbackConfigData;
  group?: GroupItem;
  isBusy: boolean;
  onToggleStatus: (config: CashbackConfigData) => void;
  onPatchConfig: (config: CashbackConfigData, patch: UpdateCashbackConfigBody) => Promise<void>;
};

type ConfigItemFormValues = {
  cashbackRatePct: string;
  minPayoutUsd: string;
  distributionCycle: DistributionCycle;
  effectiveFrom: string;
  effectiveTo: string;
};

function ConfigItemCard({ config, group, isBusy, onToggleStatus, onPatchConfig }: ConfigItemCardProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<ConfigItemFormValues>({
    defaultValues: {
      cashbackRatePct: config.cashbackRatePct.toString(),
      minPayoutUsd: config.minPayoutUsd.toString(),
      distributionCycle: config.distributionCycle,
      effectiveFrom: toDateInputValue(new Date(config.effectiveFrom)),
      effectiveTo: config.effectiveTo ? toDateInputValue(new Date(config.effectiveTo)) : "",
    },
    mode: "onChange",
  });

  const currentMinPayout = useWatch({ control, name: "minPayoutUsd" });
  const currentRate = useWatch({ control, name: "cashbackRatePct" });

  useEffect(() => {
    if (isDirty) return;
    reset({
      cashbackRatePct: config.cashbackRatePct.toString(),
      minPayoutUsd: config.minPayoutUsd.toString(),
      distributionCycle: config.distributionCycle,
      effectiveFrom: toDateInputValue(new Date(config.effectiveFrom)),
      effectiveTo: config.effectiveTo ? toDateInputValue(new Date(config.effectiveTo)) : "",
    });
  }, [config, isDirty, reset]);

  const handleCancel = () => {
    reset({
      cashbackRatePct: config.cashbackRatePct.toString(),
      minPayoutUsd: config.minPayoutUsd.toString(),
      distributionCycle: config.distributionCycle,
      effectiveFrom: toDateInputValue(new Date(config.effectiveFrom)),
      effectiveTo: config.effectiveTo ? toDateInputValue(new Date(config.effectiveTo)) : "",
    });
  };

  const handleSave = handleSubmit(async (values) => {
    const patch: UpdateCashbackConfigBody = {};

    const nextRate = Number(values.cashbackRatePct);
    if (!Number.isNaN(nextRate) && nextRate !== config.cashbackRatePct) {
      patch.cashbackRatePct = nextRate;
    }

    const nextMinPayout = Number(values.minPayoutUsd);
    if (!Number.isNaN(nextMinPayout) && nextMinPayout !== config.minPayoutUsd) {
      patch.minPayoutUsd = nextMinPayout;
    }

    if (values.distributionCycle !== config.distributionCycle) {
      patch.distributionCycle = values.distributionCycle;
    }

    if (values.effectiveFrom) {
      const isoFrom = new Date(values.effectiveFrom).toISOString();
      if (isoFrom !== config.effectiveFrom) {
        patch.effectiveFrom = isoFrom;
      }
    }

    if (!values.effectiveTo && config.effectiveTo != null) {
      patch.effectiveTo = null;
    } else if (values.effectiveTo) {
      const isoTo = new Date(values.effectiveTo).toISOString();
      if (isoTo !== config.effectiveTo) {
        patch.effectiveTo = isoTo;
      }
    }

    if (Object.keys(patch).length === 0) {
      return;
    }

    await onPatchConfig(config, patch);
    reset(values);
  });

  const isActive = config.status === "active";
  const isControlsDisabled = isBusy || isSubmitting;

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[15px] font-semibold">
            {group?.title ?? "Unknown group"}
          </div>
          <div className="text-xs text-muted-foreground">
            Chu kỳ: {distributionCycleLabel[config.distributionCycle]}
            · Min payout: {toCurrency(config.minPayoutUsd)}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Hiệu lực từ {toDateTime(config.effectiveFrom)}
            {config.effectiveTo
              ? ` · đến ${toDateTime(config.effectiveTo)}`
              : " · vô thời hạn"}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground font-semibold">
            Trạng thái
          </span>
          <div className="inline-flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={() => onToggleStatus(config)}
              disabled={isControlsDisabled}
            />
            <Badge variant="outline" className={statusBadgeClass(config.status)}>
              {configStatusLabel[config.status]}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
        <Controller
          control={control}
          name="cashbackRatePct"
          rules={{
            required: "Giá trị là bắt buộc",
            validate: (value) => {
              const n = Number(value);
              if (Number.isNaN(n) || n < 0 || n > 50) return "Trong khoảng 0-50";
              return true;
            },
          }}
          render={({ field }) => (
            <>
              <input
                type="range"
                min={0}
                max={50}
                value={field.value}
                onChange={field.onChange}
                className="cashback-slider w-full"
                disabled={isControlsDisabled}
              />
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1 items-end">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-20 h-10 bg-surface-2 border border-border rounded-lg text-center font-geist-mono text-lg font-semibold text-brand outline-none focus:border-brand"
                    disabled={isControlsDisabled}
                  />
                  {errors.cashbackRatePct && (
                    <span className="text-xs text-destructive text-right mt-1 w-full absolute -bottom-5">
                      {errors.cashbackRatePct.message}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground font-medium mb-auto mt-2.5">%</span>
              </div>
            </>
          )}
        />
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <div className="space-y-2 relative">
          <div className="text-xs font-medium text-muted-foreground">Chu kỳ phân phối</div>
          <Controller
            control={control}
            name="distributionCycle"
            render={({ field }) => (
              <select
                className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm outline-none focus:border-brand"
                value={field.value}
                onChange={field.onChange}
                disabled={isControlsDisabled}
              >
                <option value="weekly">{distributionCycleLabel.weekly}</option>
                <option value="monthly">{distributionCycleLabel.monthly}</option>
              </select>
            )}
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Mức chi trả tối thiểu (USD)</div>
          <input
            type="number"
            min={1}
            disabled={isControlsDisabled}
            {...register("minPayoutUsd", {
              required: "Min payout là bắt buộc",
              validate: (val) => {
                const n = Number(val);
                if (Number.isNaN(n) || n < 1) return "Min payout phải từ $1 trở lên";
                return true;
              },
            })}
            className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm outline-none focus:border-brand"
          />
          {errors.minPayoutUsd ? (
            <p className="text-xs text-destructive">{errors.minPayoutUsd.message}</p>
          ) : (
            <div className="text-[11px] text-muted-foreground">
              Hiển thị bằng: <span className="font-medium">{toCurrency(Number(currentMinPayout) || 0)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Hiệu lực từ</div>
          <input
            type="datetime-local"
            disabled={isControlsDisabled}
            {...register("effectiveFrom", { required: "Ngày bắt đầu là bắt buộc" })}
            className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm outline-none focus:border-brand"
          />
          {errors.effectiveFrom && (
            <p className="text-xs text-destructive">{errors.effectiveFrom.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Hiệu lực đến (có thể bỏ trống)</div>
          <input
            type="datetime-local"
            disabled={isControlsDisabled}
            {...register("effectiveTo")}
            className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm outline-none focus:border-brand"
          />
        </div>
      </div>

      {isDirty && (
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isControlsDisabled}
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isControlsDisabled}
          >
            Lưu
          </Button>
        </div>
      )}
    </div>
  );
}

export function ConfigsTable({
  configs,
  groups,
  page,
  limit,
  totalItems,
  totalPages,
  isFetching,
  statusFilter,
  isUpdating,
  onStatusFilterChange,
  onPageChange,
  onToggleConfigStatus,
  onPatchConfig,
}: ConfigsTableProps) {
  const startIndex = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalItems);

  const selectFilters: SelectFilterConfig[] = useMemo(
    () => [
      {
        key: "status",
        label: "Trạng thái",
        options: [
          { value: "active", label: configStatusLabel.active },
          { value: "inactive", label: configStatusLabel.inactive },
        ],
      },
    ],
    [],
  );

  const activeFilterChips: ActiveFilterChip[] =
    statusFilter !== "all"
      ? [{ key: "status", label: "Trạng thái", valueLabel: configStatusLabel[statusFilter] }]
      : [];

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] overflow-visible relative">
      <TableFilterBar
        textFilters={[]}
        textValues={{}}
        selectFilters={selectFilters}
        activeFilterChips={activeFilterChips}
        disabled={isFetching || isUpdating}
        onTextChange={() => undefined}
        onSelectFilter={(_, value) => onStatusFilterChange(value as ConfigStatusFilter | "all")}
        onRemoveChip={() => onStatusFilterChange("all")}
      />

      <div className="rounded-b-[14px] overflow-hidden p-5 space-y-4">
        {isFetching && configs.length === 0 ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <CashbackItemSkeleton key={i} />
            ))}
          </div>
        ) : configs.length === 0 ? (
          <div className="text-sm text-muted-foreground">Chưa có cashback config.</div>
        ) : (
          <div className="flex flex-col gap-4 relative">
            {isFetching && (
              <div className="absolute inset-x-0 -top-2 h-0.5 overflow-hidden">
                <div className="h-full bg-brand animate-progress-line" />
              </div>
            )}
            {configs.map((config) => (
              <ConfigItemCard
                key={config.id}
                config={config}
                group={groups.find((group) => group.id === config.telegramGroupId)}
                isBusy={isFetching || isUpdating}
                onToggleStatus={onToggleConfigStatus}
                onPatchConfig={onPatchConfig}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-1/60 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {totalItems > 0
              ? `Hiển thị ${startIndex} - ${endIndex} của ${totalItems} config`
              : "Chưa có cashback config."}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={isFetching || page <= 1}
            >
              Trước
            </Button>
            <span>
              Trang {page}/{Math.max(1, totalPages)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onPageChange(page + 1)}
              disabled={isFetching || page >= Math.max(1, totalPages)}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
