import React from 'react'
import { tierCommissions } from '../constants'

export default function KolTierCommission() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-1">
        <h4 className="text-sm md:text-base font-semibold text-white">Hoa hồng theo tier</h4>
        <p className="text-xs md:text-sm text-muted-foreground">Đóng góp hoa hồng kỳ này</p>
      </div>

      <div className="flex-1 flex flex-col gap-3 w-full">
        {tierCommissions.map((item, index) => (
          <React.Fragment key={item.tier}>
            {index > 0 && <div className="w-full h-px bg-surface-control" />}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={`/images/tier_icons/${item.tier}_icon.svg`}
                    className="w-5 h-5 shrink-0"
                    alt={item.tier}
                  />
                  <span className="text-sm md:text-base font-semibold text-white">{item.tier}</span>
                </div>
                <span className="text-sm md:text-base font-normal text-white">{item.amount}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 relative rounded-full overflow-hidden bg-surface-control">
                <div
                  className="h-full bg-[#D4A74A] rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
