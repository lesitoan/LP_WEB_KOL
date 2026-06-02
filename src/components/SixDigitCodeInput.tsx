"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

type SixDigitCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  idPrefix?: string;
  className?: string;
};

export function SixDigitCodeInput({
  value,
  onChange,
  onComplete,
  disabled,
  idPrefix = "twoFactorCode",
  className,
}: SixDigitCodeInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = useMemo(() => value.replace(/\D/g, "").slice(0, 6).padEnd(6, " ").split(""), [value]);

  useEffect(() => {
    if (!disabled) refs.current[0]?.focus();
  }, [disabled]);

  const updateValue = (nextCode: string) => {
    const normalized = nextCode.replace(/\D/g, "").slice(0, 6);
    onChange(normalized);
    if (normalized.length === 6) onComplete?.(normalized);
  };

  const setDigit = (index: number, nextValue: string) => {
    const numeric = nextValue.replace(/\D/g, "");
    if (!numeric) {
      const nextDigits = digits.map((digit) => (digit === " " ? "" : digit));
      nextDigits[index] = "";
      updateValue(nextDigits.join(""));
      return;
    }

    const nextDigits = digits.map((digit) => (digit === " " ? "" : digit));
    numeric.slice(0, 6 - index).split("").forEach((digit, offset) => {
      nextDigits[index + offset] = digit;
    });
    const nextCode = nextDigits.join("");
    updateValue(nextCode);

    const nextFocusIndex = Math.min(index + numeric.length, 5);
    refs.current[nextFocusIndex]?.focus();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    updateValue(pasted);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {digits.map((digit, index) => (
        <input
          key={`${idPrefix}-${index}`}
          ref={(element) => {
            refs.current[index] = element;
          }}
          id={`${idPrefix}-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          disabled={disabled}
          value={digit === " " ? "" : digit}
          maxLength={1}
          aria-label={`Mã xác thực chữ số ${index + 1}`}
          className="h-10 w-10 rounded-md border border-input bg-surface-0/80 text-center text-lg font-semibold text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
          onChange={(event) => setDigit(index, event.target.value)}
          onPaste={handlePaste}
          onKeyDown={(event) => {
            if (event.key === "Backspace") {
              event.preventDefault();
              const nextDigits = digits.map((currentDigit) => (currentDigit === " " ? "" : currentDigit));
              if (nextDigits[index]) {
                nextDigits[index] = "";
                updateValue(nextDigits.join(""));
                return;
              }
              if (index > 0) {
                nextDigits[index - 1] = "";
                updateValue(nextDigits.join(""));
                refs.current[index - 1]?.focus();
              }
            }
            if (event.key === "ArrowLeft" && index > 0) {
              refs.current[index - 1]?.focus();
            }
            if (event.key === "ArrowRight" && index < 5) {
              refs.current[index + 1]?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}
