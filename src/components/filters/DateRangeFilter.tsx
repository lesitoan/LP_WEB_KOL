"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateRange = {
  from?: Date;
  to?: Date;
};

type DateRangeFilterProps = {
  from: string;
  to: string;
  isGetAllTime?: boolean;
  isInvalidRange?: boolean;
  className?: string;
  triggerClassName?: string;
  onChange: (range: { from?: string; to?: string; isGetAllTime?: boolean }) => void;
};

const weekdayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function formatIsoToDisplay(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(first: Date, second: Date) {
  return startOfDay(first).getTime() === startOfDay(second).getTime();
}

function isDayBefore(first: Date, second: Date) {
  return startOfDay(first).getTime() < startOfDay(second).getTime();
}

function isDayAfter(first: Date, second: Date) {
  return startOfDay(first).getTime() > startOfDay(second).getTime();
}

function isDayInRange(day: Date, range: DateRange) {
  if (!range.from || !range.to) return false;

  const time = startOfDay(day).getTime();
  return time > startOfDay(range.from).getTime() && time < startOfDay(range.to).getTime();
}

function getCalendarDays(month: Date) {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
  const firstVisibleDay = new Date(firstOfMonth);
  firstVisibleDay.setDate(firstOfMonth.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(firstVisibleDay);
    day.setDate(firstVisibleDay.getDate() + index);
    return day;
  });
}

export default function DateRangeFilter({
  from,
  to,
  isGetAllTime = false,
  isInvalidRange = false,
  className,
  triggerClassName,
  onChange,
}: DateRangeFilterProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => parseIsoDate(to) ?? new Date());
  const selectedRange = useMemo<DateRange>(
    () => ({
      from: parseIsoDate(from),
      to: parseIsoDate(to),
    }),
    [from, to],
  );
  const [draftRange, setDraftRange] = useState<DateRange>(selectedRange);
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const today = useMemo(() => startOfDay(new Date()), []);

  useEffect(() => {
    setDraftRange(selectedRange);
  }, [selectedRange]);

  useEffect(() => {
    if (!isCalendarOpen) return;

    setVisibleMonth(selectedRange.from ?? selectedRange.to ?? new Date());
  }, [isCalendarOpen, selectedRange]);

  const applyRange = (range: DateRange) => {
    if (!range.from || !range.to) return;

    onChange({
      from: toIsoDate(range.from),
      to: toIsoDate(range.to),
      isGetAllTime: false,
    });
    setIsCalendarOpen(false);
  };

  const applyAllTime = () => {
    onChange({
      from: "",
      to: "",
      isGetAllTime: true,
    });
    setIsCalendarOpen(false);
  };

  const changeVisibleMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const selectDay = (day: Date) => {
    if (isDayAfter(day, today)) return;

    if (!draftRange.from || draftRange.to) {
      setDraftRange({ from: day });
      return;
    }

    if (isDayBefore(day, draftRange.from)) {
      applyRange({ from: day, to: draftRange.from });
      return;
    }

    applyRange({ from: draftRange.from, to: day });
  };

  return (
    <div className={cn("flex w-fit max-w-full self-end flex-col items-end gap-1", className)}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-fit max-w-full items-center justify-between gap-2 rounded-lg border bg-surface-2 px-2 py-1 text-sm text-foreground outline-none transition-colors",
              "hover:border-border-strong hover:bg-surface-3 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
              isInvalidRange ? "border-red-500/70" : "border-border/60",
              triggerClassName,
            )}
            >
            {isGetAllTime ? (
              <span className="font-medium">Tất cả</span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <span className="font-medium">{formatIsoToDisplay(from)}</span>
                <span className="text-muted-foreground">-</span>
                <span className="font-medium">{formatIsoToDisplay(to)}</span>
              </span>
            )}
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(calc(100vw-2rem),336px)] border-border/60 bg-surface-2 p-1.5 shadow-2xl">
          <button
            type="button"
            onClick={applyAllTime}
            className={cn(
              "mb-0.5 flex h-8 w-full items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors",
              isGetAllTime
                ? "border-border/50 bg-surface-1 text-foreground"
                : "border-border/40 bg-surface-1 text-foreground hover:border-border hover:bg-surface-3",
            )}
          >
            Tất cả
          </button>
          <div className="rounded-lg border border-border/50 bg-surface-1 p-1">
            <div className="mb-2 flex h-9 items-center justify-between">
              <button
                type="button"
                onClick={() => changeVisibleMonth(-1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-3 text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                aria-label="Thang truoc"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-sm font-semibold text-foreground">
                {visibleMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
              </p>
              <button
                type="button"
                onClick={() => changeVisibleMonth(1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-3 text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                aria-label="Thang sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weekdayLabels.map((label) => (
                <div key={label} className="flex h-7 items-center justify-center text-[11px] font-medium text-muted-foreground">
                  {label}
                </div>
              ))}
              {calendarDays.map((day) => {
                const isOutsideMonth = day.getMonth() !== visibleMonth.getMonth();
                const isFutureDay = isDayAfter(day, today);
                const isRangeStart = Boolean(draftRange.from && isSameDay(day, draftRange.from));
                const isRangeEnd = Boolean(draftRange.to && isSameDay(day, draftRange.to));
                const isRangeMiddle = isDayInRange(day, draftRange);
                const isSelected = isRangeStart || isRangeEnd;

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={isFutureDay}
                    onClick={() => selectDay(day)}
                    className={cn(
                      "flex h-8 items-center justify-center rounded-md text-sm transition-colors outline-none",
                      "hover:bg-surface-4 focus-visible:ring-2 focus-visible:ring-ring/40",
                      isOutsideMonth && "text-muted-foreground/40",
                      isFutureDay && "cursor-not-allowed border-0 text-muted-foreground/20 opacity-50 hover:bg-transparent",
                      isSameDay(day, today) && !isSelected && "border border-brand text-foreground",
                      isRangeMiddle && "rounded-none bg-brand/20 text-foreground hover:bg-brand/25",
                      isSelected && "bg-brand text-primary-foreground hover:bg-brand",
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {isInvalidRange ? (
        <p className="text-xs font-normal text-red-400">Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu</p>
      ) : null}
    </div>
  );
}
