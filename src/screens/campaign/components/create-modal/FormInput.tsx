import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  isTextarea?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(({ 
  label, 
  isTextarea, 
  icon, 
  iconPosition = 'left',
  className = '', 
  error,
  ...props 
}, ref) => {
  const textareaProps = props as React.TextareaHTMLAttributes<HTMLTextAreaElement>;

  const baseInputClass = `w-full bg-[#131313] border ${error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#006AF5]'} rounded-xl text-[14px] text-white placeholder-[#8B8B93] focus:outline-none transition-colors`;

  const paddingClass = icon 
    ? iconPosition === 'left' ? 'pl-11 pr-4 py-3' : 'pl-4 pr-11 py-3'
    : 'px-4 py-3';

  // Hỗ trợ click vào icon để mở date picker
  const handleIconClick = (e: React.MouseEvent) => {
    const parent = e.currentTarget.parentElement;
    if (parent) {
      const input = parent.querySelector('input');
      if (input) {
        if (typeof input.showPicker === 'function') {
          input.showPicker();
        } else {
          input.focus();
        }
      }
    }
  };

  return (
    <div className={className}>
      <label className="block text-[13px] text-white font-semibold mb-2">
        {label} {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      
      <div className="relative">
        {isTextarea ? (
          <textarea
            {...textareaProps}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={`${baseInputClass} ${paddingClass} resize-none`}
            rows={textareaProps.rows || 4}
          />
        ) : (
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            ref={ref as React.Ref<HTMLInputElement>}
            className={`${baseInputClass} ${paddingClass}`}
          />
        )}

        {icon && (
          <div 
            onClick={handleIconClick}
            className={`absolute top-1/2 -translate-y-1/2 cursor-pointer z-10 ${iconPosition === 'left' ? 'left-4' : 'right-4'}`}
          >
            {icon}
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-[12px] text-red-500 font-medium animate-fade-in-up">{error}</p>}
    </div>
  );
});

FormInput.displayName = 'FormInput';
export default FormInput;
