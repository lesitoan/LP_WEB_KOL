'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { PartnerTier } from '../constants'

type PartnerHeroProps = {
  tiers: PartnerTier[]
}

const getActiveTierName = (count: number) => {
  if (count < 50) return 'STARTER'
  if (count < 200) return 'PARTNER'
  if (count < 1000) return 'ELITE'
  return 'LEGEND'
}

const getActiveTierRate = (count: number) => {
  if (count < 50) return 30
  if (count < 200) return 40
  if (count < 1000) return 50
  return 60
}

export default function PartnerHero({ tiers }: PartnerHeroProps) {
  const [members, setMembers] = useState(1000)

  const activeTierName = getActiveTierName(members)
  const activeTierRate = getActiveTierRate(members)
  const estimatedIncome = members * 20 * (activeTierRate / 100) * 0.4

  return (
    <section className="relative mx-auto grid w-full max-w-[1320px] gap-10 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:py-24 animate-fade-in">
      <div className="pointer-events-none absolute -left-28 top-0 h-80 w-80 rounded-full bg-brand/20 blur-[120px]" />
      <div className="relative">
        <h1 className="max-w-xl text-6xl font-semibold leading-tight md:text-5xl bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Hãy biến cộng đồng của bạn thành thu nhập bền vững
        </h1>
        <p className="mt-6 max-w-lg text-2xl font-medium leading-6 text-[#bdbdbd]">
          Sử dụng công cụ minh hoạ bên cạnh để xem thu nhập tiềm năng theo quy mô cộng đồng của bạn.
        </p>
        <Link href="/login" className="mt-7 inline-flex h-11 items-center rounded-[8px] bg-brand pl-7 pr-3 text-base font-semibold text-black uppercase hover:bg-brand-bright transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(247,240,161,0.2)]">
          ĐĂNG KÝ PARTNER
          <span className="ml-3 flex h-5 w-5 items-center justify-center rounded-full bg-black text-brand">
            <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
          </span>
        </Link>
      </div>

      <div
        className="relative rounded-[24px] p-[3px] shadow-[0_0_38px_rgba(247,240,161,0.13)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(247,240,161,0.2)] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFF9B3 0%, #FFEF3C 20%, #746B00 45%, #746B00 55%, #FFEF3C 80%, #FFF9B3 100%)'
        }}
      >
        <style>{`
          .custom-range::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            appearance: none !important;
            width: 16px !important;
            height: 16px !important;
            border-radius: 50% !important;
            background: #ffef3c !important;
            border: 2.5px solid #ffffff !important;
            cursor: pointer !important;
            box-shadow: 0 0 10px rgba(255, 239, 60, 0.5) !important;
          }
          .custom-range::-moz-range-thumb {
            width: 16px !important;
            height: 16px !important;
            border-radius: 50% !important;
            background: #ffef3c !important;
            border: 2.5px solid #ffffff !important;
            cursor: pointer !important;
            box-shadow: 0 0 10px rgba(255, 239, 60, 0.5) !important;
          }
        `}</style>
        <div className="relative h-full w-full rounded-[21px] bg-[#0f0f0f] p-7 space-y-6 overflow-hidden">
          {/* Top light glow background */}
          <div
            className="absolute -top-1 left-0 right-0 h-[150px] bg-no-repeat bg-top bg-cover pointer-events-none opacity-80"
            style={{ backgroundImage: 'url("/images/partner/Ellipse.png")' }}
          />

          <div className="relative space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 text-xl font-semibold">
                <span className="text-[#bdbdbd]">Số thành viên cộng đồng</span>
                <span className="shrink-0 font-bold text-lg">
                  <span className="text-brand">{new Intl.NumberFormat('en-US').format(members)}</span>{' '}
                  <span className="text-white font-medium">members</span>
                </span>
              </div>
              <div className="relative py-2">
                <input
                  type="range"
                  min="10"
                  max="5000"
                  step="10"
                  value={members}
                  onChange={(e) => setMembers(Number(e.target.value))}
                  className="custom-range w-full h-1.5 bg-white/15 rounded-full appearance-none cursor-pointer outline-none focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #ffef3c 0%, #ffef3c ${((members - 10) / 4990) * 100}%, rgba(255,255,255,0.15) ${((members - 10) / 4990) * 100}%, rgba(255,255,255,0.15) 100%)`
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-4 text-xl font-semibold">
                <span className="text-[#bdbdbd]">Hoa hồng</span>
                <span className="shrink-0 font-bold text-lg">
                  <span className="text-brand">{activeTierRate}%</span>{' '}
                  <span className="text-white font-medium">- Tier {activeTierName}</span>
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-[linear-gradient(180deg,rgba(247,240,161,0.24),rgba(0,0,0,0.78))] px-6 py-7 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <p className="text-lg font-normal text-white/80">Thu nhập tiềm năng mỗi tháng</p>
              <div className="mt-3 text-5xl font-bold text-white transition-all duration-200">
                ~${new Intl.NumberFormat('en-US').format(Math.round(estimatedIncome))}{' '}
                <span className="text-3xl font-normal text-white">/ tháng</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              {tiers.map((tier) => {
                const isActive = tier.name === activeTierName
                return (
                  <div
                    key={tier.name}
                    className={`relative rounded-lg p-[1.5px] transition-all duration-300 ${
                      isActive ? 'shadow-[0_0_15px_rgba(247,240,161,0.1)]' : ''
                    }`}
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #FFF9B3 0%, #FFEF3C 20%, #746B00 45%, #746B00 55%, #FFEF3C 80%, #FFF9B3 100%)'
                        : 'rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    <div className="rounded-[6.5px] bg-[#0f0f0f] px-3 py-4 text-center">
                      <div className={`text-xl font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-[#8f8f8f]'}`}>
                        {tier.name}
                      </div>
                      <div className="mt-1 text-2xl md:text-3xl font-bold text-white">
                        {tier.rate}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-center text-base font-medium leading-5 text-[#8f8f8f]">
              Số minh hoạ - giả định mỗi thành viên đóng góp ~$20 phí/tháng. Thu nhập thực tế phụ thuộc hoạt động cộng đồng.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
