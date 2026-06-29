import React from 'react'
import { forwardsByContent } from '../constants'

export default function ForwardsByContent() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-1">
        <h4 className="text-sm md:text-base font-semibold text-white">Lượt forward theo nội dung</h4>
        <p className="text-xs md:text-sm text-[#A8A8A9]">Số tuyệt đối · sắp xếp giảm dần</p>
      </div>

      <div className="flex-1 flex flex-col gap-3 w-full pt-2">
        {forwardsByContent.map((item, index) => (
          <React.Fragment key={item.title}>
            {index > 0 && <div className="w-full h-px bg-surface-control" />}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base font-semibold text-white">{item.title}</span>
                <span className="text-sm md:text-base font-normal text-white">{item.fwdText}</span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="w-full h-2 bg-[#282828] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#D4A74A] rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
