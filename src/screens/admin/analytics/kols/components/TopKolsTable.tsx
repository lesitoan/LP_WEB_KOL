import React from 'react'
import { topKols } from '../constants'

const tierBadgeStyles: Record<string, string> = {
  STARTER: 'bg-[#4D2C03] text-[#FAB55A]',
  PARTNER: 'bg-[#06301C] text-[#60CF9B]',
  ELITE: 'bg-[#002D67] text-[#549BF8]',
  LEGEND: 'bg-[#4D2C03] text-[#FAB55A]',
}

export default function TopKolsTable() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full">
      <div className="space-y-1 pb-4">
        <h4 className="text-sm md:text-base font-semibold text-white">Top KOL theo hoa hồng</h4>
        <p className="text-xs md:text-sm text-muted-foreground">Kỳ hôm nay</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-xs font-normal text-muted-foreground">
              <th className="py-2.5 px-1.5 md:py-3 md:px-2 w-[60px] font-normal">STT</th>
              <th className="py-2.5 px-1.5 md:py-3 md:px-2 font-normal">Chi tiết hoạt động</th>
              <th className="py-2.5 px-1.5 md:py-3 md:px-2 text-right font-normal">Hoa hồng</th>
            </tr>
          </thead>
          <tbody>
            {topKols.map((kol) => (
              <tr key={kol.stt} className="border-b border-border/40 hover:bg-surface-2/30 transition-colors">
                <td className="py-3 px-1.5 md:py-4 md:px-2 text-sm md:text-base font-normal text-[#D7D8D9]">{kol.stt}</td>
                <td className="py-3 px-1.5 md:py-4 md:px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm md:text-base font-semibold text-white">{kol.name}</span>
                    <span className={`text-[11px] md:text-xs font-normal px-2.5 py-0.5 rounded-full ${tierBadgeStyles[kol.tier]}`}>
                      {kol.tier}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-1.5 md:py-4 md:px-2 text-right text-sm md:text-base font-normal text-white">{kol.commission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
