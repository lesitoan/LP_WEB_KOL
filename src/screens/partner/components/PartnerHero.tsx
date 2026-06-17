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
  const monthlyFeeVnd = 500_000
  const estimatedIncome = members * monthlyFeeVnd * (activeTierRate / 100) * 0.4

  return (
    <section className="relative mx-auto grid w-full max-w-[1360px] gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] md:items-center animate-fade-in">
      <div className="pointer-events-none absolute -left-28 top-0 h-80 w-80 rounded-full bg-brand/20 blur-[120px]" />
      <div className="relative">
        <h1 className="max-w-xl text-6xl font-semibold leading-[78px] max-lg:text-5xl max-md:leading-[58px]">
          Hãy biến cộng đồng của bạn thành{" "}
          <span className="bg-[linear-gradient(90deg,#FFF6B8_0%,#FFFFFF_58%,#E8C878_100%)] bg-clip-text text-transparent">
            thu nhập bền vững
          </span>
          <span className="hidden">
          Hãy biến cộng đồng của bạn thành thu nhập bền vững
          </span>
        </h1>
        <p className="mt-6 max-w-lg text-2xl font-medium max-lg:text-xl leading-9 text-[#bdbdbd]">
          Sử dụng công cụ minh hoạ bên cạnh để xem thu nhập tiềm năng theo quy mô cộng đồng của bạn.
        </p>
        <Link href="/login" className="mt-9 inline-flex h-11 items-center rounded-[8px] bg-brand pl-7 pr-3 text-base font-semibold text-black uppercase hover:bg-brand-bright transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(247,240,161,0.2)]">
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
            width: 24px !important;
            height: 24px !important;
            border-radius: 50% !important;
            background: #FFD000 !important;
            border: 2px solid #ffffff !important;
            cursor: pointer !important;
            box-shadow: none !important;
          }
          .custom-range::-moz-range-thumb {
            width: 24px !important;
            height: 24px !important;
            border-radius: 50% !important;
            background: #FFD000 !important;
            border: 2px solid #ffffff !important;
            cursor: pointer !important;
            box-shadow: none !important;
          }
        `}</style>
        <div className="relative h-full w-full rounded-[21px] bg-[#0f0f0f] px-8 py-10 max-md:px-5 max-md:py-6 space-y-6 overflow-hidden">
          {/* Top light glow background */}
          <div
            className="absolute -top-1 left-0 right-0 h-[150px] bg-no-repeat bg-top bg-cover pointer-events-none opacity-80"
            style={{ backgroundImage: 'url("/images/partner/Ellipse.png")' }}
          />

          <div className="relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 text-xl font-semibold max-md:text-lg max-md:font-medium">
                <div className="flex items-center gap-2">
                  <img src="/images/partner/user_icon.svg" alt="" className="h-5 w-5 object-contain" />
                  <span className="text-[#bdbdbd]">Số thành viên cộng đồng</span>
                </div>
                <span className="shrink-0 font-bold text-lg">
                  <span className="text-[#FFBB00]">{new Intl.NumberFormat('en-US').format(members)}</span>{' '}
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
                  className="custom-range w-full h-2 bg-white/15 rounded-full appearance-none cursor-pointer outline-none focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #D4A74A 0%, #D4A74A ${((members - 10) / 4990) * 100}%, rgba(255,255,255,0.15) ${((members - 10) / 4990) * 100}%, rgba(255,255,255,0.15) 100%)`
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-4 text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <img src="/images/partner/commission_icon.svg" alt="" className="h-5 w-5 object-contain" />
                  <span className="text-[#bdbdbd]">Hoa hồng</span>
                </div>
                <span className="shrink-0 font-bold text-lg">
                  <span className="text-[#FFBB00]">{activeTierRate}%</span>{' '}
                  <span className="text-white font-medium">- Tier {activeTierName}</span>
                </span>
              </div>
            </div>
            <div className="mt-14 rounded-lg bg-[url('/images/partner/hero_bg.png')] bg-cover bg-center px-6 py-7 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <p className="text-lg font-normal text-white/80">Thu nhập tiềm năng mỗi tháng</p>
              <div className="mt-3 text-5xl max-xl:text-4xl max-lg:text-3xl font-bold text-white transition-all duration-200">
                ~{new Intl.NumberFormat('vi-VN').format(Math.round(estimatedIncome))}
                <span className="text-3xl max-lg:text-2xl max-md:text-xl font-normal text-white">/ tháng</span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-3 text-center max-lg:grid-cols-2">
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
                      <div className={`text-xl max-lg:text-lg font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-[#8f8f8f]'}`}>
                        {tier.name}
                      </div>
                      <div className="mt-1 text-2xl max-lg:text-xl font-bold text-white">
                        {tier.rate}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-8 text-center text-base font-medium leading-5 text-[#8f8f8f]">
              Số minh hoạ - giả định mỗi thành viên đóng góp 500.000 VNĐ phí/tháng. Thu nhập thực tế phụ thuộc hoạt động cộng đồng.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
