import React, { forwardRef } from "react";

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  isTextarea?: boolean;
  icon?: React.ReactNode;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  ({ label, isTextarea, icon, className = "", error, ...props }, ref) => {
    const textareaProps = props as React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    const baseClass = `w-full bg-[#111111] border ${
      error ? "border-red-500" : "border-white/10 focus:border-[#F7F0A1]/70"
    } rounded-[8px] text-[13px] text-white placeholder-[#77777D] focus:outline-none transition-colors`;
    const paddingClass = icon ? "pl-9 pr-3 py-2.5" : "px-3 py-2.5";

    const handleIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const input = e.currentTarget.parentElement?.querySelector("input");
      if (!input) return;
      if (typeof input.showPicker === "function") input.showPicker();
      else input.focus();
    };

    return (
      <div className={className}>
        <label className="block text-[12px] font-semibold text-white/85 mb-1.5">
          {label}
        </label>
        <div className="relative">
          {isTextarea ? (
            <textarea
              {...textareaProps}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={`${baseClass} ${paddingClass} min-h-[104px] resize-none`}
              rows={textareaProps.rows || 4}
            />
          ) : (
            <input
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
              ref={ref as React.Ref<HTMLInputElement>}
              className={`${baseClass} ${paddingClass}`}
            />
          )}
          {icon && (
            <div
              onClick={handleIconClick}
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#8B8B93]"
            >
              {icon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
