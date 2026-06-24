import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  min?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export default function DateTimePicker({
  value,
  onChange,
  min,
  label,
  error,
  placeholder,
  disabled,
  className = "",
  icon,
}: DateTimePickerProps) {
  const selectedDate = value ? new Date(value) : null;
  const minDate = min ? new Date(min) : undefined;

  const handleChange = (date: Date | null) => {
    if (!date) {
      onChange("");
      return;
    }
    // Format to local ISO YYYY-MM-DDTHH:mm
    const tzOffset = date.getTimezoneOffset() * 60000;
    const formatted = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    onChange(formatted);
  };

  const filterPassedTime = (time: Date) => {
    if (!min) return true;
    const minDateObj = new Date(min);
    const selected = selectedDate || new Date();
    
    const selectedCopy = new Date(selected);
    selectedCopy.setHours(0, 0, 0, 0);
    
    const minCopy = new Date(minDateObj);
    minCopy.setHours(0, 0, 0, 0);
    
    if (selectedCopy.getTime() > minCopy.getTime()) return true;
    if (selectedCopy.getTime() < minCopy.getTime()) return false;
    
    return time.getTime() >= minDateObj.getTime();
  };

  const CustomInput = forwardRef<HTMLButtonElement, any>(
    ({ value: displayVal, onClick, disabled }, ref) => (
      <button
        type="button"
        onClick={onClick}
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full bg-[#111111] border rounded-[8px] text-[13px] md:text-[14px] font-normal text-white placeholder-[#77777D] text-left transition-colors flex items-center gap-3 relative min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed",
          error ? "border-red-500" : "border-white/10 hover:border-white/20",
          icon ? "pl-9 pr-3 py-2" : "px-3 py-2"
        )}
      >
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B93]">
            {icon}
          </div>
        )}
        {displayVal ? (
          displayVal
        ) : (
          <span className="text-[#77777D]">{placeholder || "Chọn ngày giờ"}</span>
        )}
      </button>
    )
  );
  CustomInput.displayName = "DateTimePickerCustomInput";

  return (
    <div className={className}>
      
      {label && (
        <label className="block text-[12px] md:text-[14px] font-medium text-white/85 mb-1.5">
          {label}
        </label>
      )}

      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        minDate={minDate}
        filterTime={filterPassedTime}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="dd/MM/yyyy HH:mm"
        calendarStartDay={1}
        disabled={disabled}
        customInput={<CustomInput />}
      />

      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
