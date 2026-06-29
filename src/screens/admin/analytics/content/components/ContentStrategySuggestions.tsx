import React from 'react'
import { strategySuggestions } from '../constants'

export default function ContentStrategySuggestions() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-1">
        <h4 className="text-sm md:text-base font-semibold text-white">Gợi ý chiến lược nội dung</h4>
        <p className="text-xs md:text-sm text-[#A8A8A9]">Suy ra từ dữ liệu forward</p>
      </div>

      <div className="flex-1 flex flex-col gap-3 w-full pt-2">
        {strategySuggestions.map((item, index) => (
          <React.Fragment key={item.title}>
            {index > 0 && <div className="w-full h-px bg-surface-control" />}
            
            <div className="flex items-start gap-2.5 py-1">
              <svg
                className="w-5 h-5 text-white shrink-0 fill-none stroke-current mt-0.5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              
              <div className="text-sm md:text-base text-white leading-6">
                <span className="font-semibold">{item.title}</span>
                <span className="font-normal">{item.description}</span>
                {item.highlight && (
                  <span className="font-semibold text-[#F7F0A1]">{item.highlight}</span>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
