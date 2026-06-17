import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function PartnerCtaSection() {
  return (
    <section className="mx-auto max-w-[1320px] px-5 pb-12 pt-2 animate-fade-in">
      <div className="mx-auto w-full [container-type:inline-size]">
        <div className="relative aspect-[1120/398] w-full overflow-hidden rounded-[clamp(6px,1.07cqw,12px)] bg-[url('/images/partner/CTA_bg.png')] bg-cover bg-center px-[4.29cqw] pb-[2.86cqw] pt-[2.86cqw] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
          <div className="pointer-events-none absolute inset-x-[3.57cqw] top-0 h-[24%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.42),transparent_70%)]" />

          <div className="relative z-10">
            <h2 className="whitespace-nowrap text-[clamp(14px,3.57cqw,40px)] font-bold leading-tight text-white max-[440px]:text-[11px]">
              Sẵn sàng biến cộng đồng thành thu nhập bền vững?
            </h2>
            <p className="mt-[0.36cqw] whitespace-nowrap text-[clamp(12px,2.86cqw,32px)] font-medium leading-tight text-white max-[440px]:text-[9px]">
              Tham gia chương trình Partner SCEX ngay hôm nay
            </p>
          </div>

          <div className="relative z-10 mx-[0.8cqw] mt-[1.5cqw] aspect-[1006/245] overflow-hidden rounded-[0.71cqw]">
            <Image
              src="/images/partner/CTA_banner.png"
              alt="Partner SCEX"
              fill
              sizes="(max-width: 768px) calc(100vw - 24px), 1024px"
              quality={100}
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-[6%] mx-auto h-[48%] w-[38%] select-none opacity-20">
              <Image
                src="/images/partner/Logo.png"
                alt="SCEX Logo Watermark"
                fill
                className="object-contain"
              />
            </div>
            <Link
              href="/login"
              className="absolute left-1/2 top-[13%] inline-flex h-[clamp(34px,3.93cqw,44px)] w-[clamp(150px,16.96cqw,190px)] -translate-x-1/2 items-center justify-center gap-[clamp(6px,0.71cqw,8px)] rounded-[clamp(6px,0.71cqw,8px)] bg-white text-[clamp(12px,1.43cqw,16px)] font-semibold text-black shadow-[0_0.36cqw_2.23cqw_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:bg-neutral-100"
            >
              Đăng ký partner
              <span className="grid h-[clamp(16px,1.79cqw,20px)] w-[clamp(16px,1.79cqw,20px)] place-items-center rounded-full bg-black text-white">
                <ArrowUpRight className="h-[clamp(10px,1.25cqw,14px)] w-[clamp(10px,1.25cqw,14px)] stroke-[3]" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
