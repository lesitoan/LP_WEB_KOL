import { forwardRef } from "react";
import { Coins, Clock } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";
import FormInput from "./FormInput";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import type { CampaignFormValues } from "./schema";
import { ANNOUNCE_FREQUENCY_OPTIONS, DAYS_OF_WEEK } from "./schema";

export default function StepTwo() {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext<CampaignFormValues>();
  const selectedFrequency = watch("announceFrequency");
  const selectedDay = watch("announceDayOfWeek");
  const showTimeInput = selectedFrequency === "DAILY";
  const showDaysOfWeek = selectedFrequency === "WEEKLY";

  return (
    <div className="space-y-4">
      <div className="rounded-[12px] border border-white/10 bg-[#151515] p-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] md:text-[14px] font-medium text-white/85">Phần thưởng</label>
          <Controller
            control={control}
            name="rewardType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full bg-[#111111] border border-white/10 rounded-[8px] text-[13px] md:text-[14px] font-normal text-white focus:border-[#F7F0A1]/70 h-10 px-3 py-2.5">
                  {field.value || "Tiền thưởng"}
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#171717] text-white z-[110]">
                  <SelectItem value="Tiền thưởng">Tiền thưởng</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.rewardType?.message && (
            <p className="mt-1 text-[11px] text-red-400">{errors.rewardType.message}</p>
          )}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((rank) => (
            <FormInput
              key={rank}
              label={`Hạng ${rank}`}
              placeholder="Nhập số tiền (VNĐ)"
              icon={
                <img
                  src="/images/bitcoin_logo.png"
                  alt=""
                  className="h-4 w-4 object-contain"
                />
              }
              {...register(`rank${rank}` as keyof CampaignFormValues, {
                onChange: (event) => {
                  event.target.value = event.target.value.replace(/\D/g, "");
                },
              })}
              error={errors[`rank${rank}` as keyof CampaignFormValues]?.message}
            />
          ))}
        </div>
      </div>

      <div className="rounded-[12px] border border-white/10 bg-[#151515] p-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] md:text-[14px] font-medium text-white/85">Thông báo</label>
          <Controller
            control={control}
            name="announceFrequency"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full bg-[#111111] border border-white/10 rounded-[8px] text-[13px] md:text-[14px] font-normal text-white focus:border-[#F7F0A1]/70 h-10 px-3 py-2.5">
                  {ANNOUNCE_FREQUENCY_OPTIONS.find((opt) => opt.value === field.value)?.label || "Chọn thông báo"}
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#171717] text-white z-[110]">
                  {ANNOUNCE_FREQUENCY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.announceFrequency?.message && (
            <p className="mt-1 text-[11px] text-red-400">{errors.announceFrequency.message}</p>
          )}
        </div>

        {showTimeInput && (
          <div className="mt-4 flex flex-col gap-1.5">
            <label className="text-[12px] md:text-[14px] font-medium text-white/85">Thời gian thông báo</label>
            <Controller
              control={control}
              name="announceTime"
              render={({ field }) => {
                const getSelectedTimeDate = (val?: string) => {
                  const d = new Date();
                  if (!val) return d;
                  const [h, m] = val.split(":").map(Number);
                  if (Number.isFinite(h) && Number.isFinite(m)) {
                    d.setHours(h, m, 0, 0);
                  }
                  return d;
                };

                const handleTimeChange = (date: Date | null) => {
                  if (!date) {
                    field.onChange("09:00");
                    return;
                  }
                  const h = String(date.getHours()).padStart(2, "0");
                  const m = String(date.getMinutes()).padStart(2, "0");
                  field.onChange(`${h}:${m}`);
                };

                const CustomTimeInput = forwardRef<HTMLButtonElement, any>(
                  ({ value: displayVal, onClick, disabled }, ref) => (
                    <button
                      type="button"
                      onClick={onClick}
                      ref={ref}
                      disabled={disabled}
                      className={cn(
                        "w-full bg-[#111111] border rounded-[8px] text-[13px] md:text-[14px] font-normal text-white placeholder-[#77777D] text-left transition-colors flex items-center justify-between relative min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed",
                        errors.announceTime ? "border-red-500" : "border-white/10 hover:border-white/20",
                        "px-3 py-2"
                      )}
                    >
                      <span>{displayVal || "Chọn thời gian"}</span>
                      <Clock className="h-4 w-4 text-[#8B8B93] absolute right-3 top-1/2 -translate-y-1/2" />
                    </button>
                  )
                );
                CustomTimeInput.displayName = "AnnounceTimePickerCustomInput";

                return (
                  <DatePicker
                    selected={getSelectedTimeDate(field.value)}
                    onChange={handleTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Thời gian"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    disabled={field.disabled}
                    customInput={<CustomTimeInput />}
                  />
                );
              }}
            />
            {errors.announceTime?.message && (
              <p className="text-[11px] text-red-400 mt-1">{errors.announceTime.message}</p>
            )}
          </div>
        )}

        {showDaysOfWeek && (
          <div className="mt-4">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDay === day.value;
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() =>
                      setValue("announceDayOfWeek", day.value, { shouldValidate: true })
                    }
                    className={`h-8 rounded-[7px] px-2 text-[12px] font-semibold transition-colors ${
                      isSelected
                        ? "bg-[#F7F0A1] text-black"
                        : "bg-[#242424] text-white/75 hover:bg-white/10"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            {errors.announceDayOfWeek && (
              <p className="mt-1 text-[11px] text-red-400">
                {errors.announceDayOfWeek.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
