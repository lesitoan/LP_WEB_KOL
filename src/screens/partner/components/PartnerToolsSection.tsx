import React from 'react'
import type { PartnerBenefit } from '../constants'
import { Settings, Search } from 'lucide-react'

type PartnerToolsSectionProps = {
  benefits: PartnerBenefit[]
}

// Custom Market Insight Icon
function MarketInsightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" strokeWidth="2" />
      <path d="M7 14.5l3-3 2.5 2.5 4.5-4.5" strokeWidth="2" />
      <path d="M13.5 9.5H17V13" strokeWidth="2" />
    </svg>
  )
}

// Custom Podium Icon
function PodiumIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <rect x="4" y="14" width="4" height="6" rx="0.5" />
      <rect x="10" y="11" width="4" height="9" rx="0.5" />
      <rect x="16" y="16" width="4" height="4" rx="0.5" />
      <polygon points="12,2 13.5,5 17,5 14,7 15,10.5 12,8.5 9,10.5 10,7 7,5 10.5,5" />
    </svg>
  )
}

const getIcon = (index: number) => {
  switch (index) {
    case 0:
      return Settings
    case 1:
      return Search
    case 2:
      return MarketInsightIcon
    case 3:
      return PodiumIcon
    default:
      return Settings
  }
}

export default function PartnerToolsSection({ benefits }: PartnerToolsSectionProps) {
  return (
    <section className="mx-auto max-w-[1320px] px-5 pb-16 animate-fade-in">
      <h2 className="text-center text-4xl font-medium">Bộ công cụ hữu ích dành cho Partners</h2>
      <div className="mt-8 grid gap-0 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => {
          const Icon = getIcon(index)
          const borderTop = index % 2 === 0 // 0,2 = top; 1,3 = bottom
          return (
            <div
              key={benefit.title}
              className="group relative rounded-2xl p-[1.5px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
              style={{
                background: borderTop
                  ? 'linear-gradient(to bottom, #FFFDE4 0%, #F7F0A1 30%, transparent 50%, transparent 100%)'
                  : 'linear-gradient(to top, #FFFDE4 0%, #F7F0A1 30%, transparent 50%, transparent 100%)',
              }}
            >
              <article
                className="rounded-[14px] p-5"
                style={{
                  background: borderTop
                    ? 'linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%)'
                    : 'linear-gradient(to top, #1a1a1a 0%, #0a0a0a 100%)',
                }}
              >
                {/* Header row: Number on left, Icon box on right */}
                <div className="flex items-center justify-between">
                  <div className="font-black text-5xl font-semibold italic leading-none text-white/[0.07] select-none [-webkit-text-stroke:1.3px_rgba(255,255,255,0.34)] drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                    <span className="text-5xl font-semibold">#</span>
                    {index + 1}
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#1e1e1e] text-[#ffcf12]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Text content */}
                <div className="mt-5">
                  <h3 className="text-2xl  font-medium text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-base font-normal leading-[20px] text-[#8c8c8c]">{benefit.body}</p>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </section>
  )
}
