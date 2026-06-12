import React, { forwardRef } from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  bg?: string;
  error?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({ 
  label, 
  options, 
  bg = 'bg-[#131313]', 
  className = '', 
  error,
  ...props 
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[13px] text-white font-semibold mb-2">
          {label} {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          {...props}
          ref={ref}
          className={`w-full ${bg} border ${error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#006AF5]'} rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none transition-colors`}
        >
          <option value="" disabled hidden>Chọn giá trị</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <svg className="w-4 h-4 text-[#8B8B93] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Dòng text báo lỗi màu đỏ */}
      {error && <p className="mt-1.5 text-[12px] text-red-500 font-medium animate-fade-in-up">{error}</p>}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';
export default FormSelect;