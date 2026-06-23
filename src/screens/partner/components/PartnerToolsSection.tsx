import React from 'react'
import type { PartnerBenefit } from '../constants'

type PartnerToolsSectionProps = {
  benefits: PartnerBenefit[]
}

export default function PartnerToolsSection({ benefits }: PartnerToolsSectionProps) {
  return (
    <section className="mx-auto max-w-[1320px] px-5 animate-fade-in">
      <h2 className="text-center text-4xl  font-medium max-lg:text-3xl">Bộ công cụ hữu ích dành cho Partners</h2>
      <div className="mt-8 grid gap-0 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => {
          const borderTop = index % 2 === 0 // 0,2 = top; 1,3 = bottom
          return (
            <div
              key={benefit.title}
              className="group relative rounded-2xl p-[1.5px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] h-full"
              style={{
                background: borderTop
                  ? 'linear-gradient(to bottom, #FFFDE4 0%, #F7F0A1 30%, transparent 50%, transparent 100%)'
                  : 'linear-gradient(to top, #FFFDE4 0%, #F7F0A1 30%, transparent 50%, transparent 100%)',
              }}
            >
              <article
                className="rounded-card p-5 h-full flex flex-col"
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
                  <img src={benefit.icon} alt="" className="h-[60px] w-[60px] object-contain" />
                </div>

                {/* Text content */}
                <div className="mt-5 flex-1">
                  <h3 className="text-2xl  font-medium text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-base font-normal leading-[20px] text-muted-foreground">{benefit.body}</p>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </section>
  )
}

