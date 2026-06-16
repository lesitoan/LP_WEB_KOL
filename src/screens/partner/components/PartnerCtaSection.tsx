import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function PartnerCtaSection() {
  return (
    <section className="mx-auto max-w-[1320px] px-5 pb-12 pt-2 animate-fade-in">
      {/* Container query wrapper to scale all child elements proportionally */}
      <div className="mx-auto w-full [container-type:inline-size]">
        <div className="relative aspect-[1120/398] w-full overflow-hidden rounded-[clamp(6px,1.07cqw,12px)] bg-[url('/images/partner/CTA_bg.png')] bg-cover bg-center px-[4.29cqw] pb-[2.86cqw] pt-[2.86cqw] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
          <div className="pointer-events-none absolute inset-x-[3.57cqw] top-0 h-[24%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.42),transparent_70%)]" />

          <div className="relative z-10">
            <h2 className="text-[clamp(10px,3.21cqw,36px)] font-bold leading-tight text-white whitespace-nowrap">
              Sẵn sàng biến cộng đồng thành thu nhập bền vững?
            </h2>
            <p className="mt-[0.71cqw] text-[clamp(8px,2.68cqw,30px)] font-medium leading-tight text-white whitespace-nowrap">
              Tham gia chương trình Partner SCEX ngay hôm nay
            </p>
          </div>

          <div className="relative z-10 mx-[0.8cqw] mt-[1.5cqw] aspect-[1006/234] overflow-hidden rounded-[0.71cqw]">
            <Image
              src="/images/partner/CTA_banner.png"
              alt="Partner SCEX"
              fill
              sizes="(max-width: 768px) calc(100vw - 24px), 1024px"
              quality={100}
              className="object-cover object-center"
            />
            {/* Watermark logo overlay */}
            <div className="absolute inset-x-0 bottom-[6%] mx-auto h-[48%] w-[38%] pointer-events-none opacity-20 select-none">
              <Image
                src="/images/partner/Logo.png"
                alt="SCEX Logo Watermark"
                fill
                className="object-contain"
              />
            </div>
            <Link
              href="/login"
              className="absolute left-1/2 top-[13%] inline-flex -translate-x-1/2 items-center gap-[clamp(5px,0.71cqw,8px)] rounded-[clamp(4px,0.54cqw,6px)] bg-white px-[clamp(10px,1.43cqw,16px)] py-[clamp(5px,0.71cqw,8px)] text-[clamp(10px,1.07cqw,12px)] font-bold text-black shadow-[0_0.36cqw_2.23cqw_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:bg-neutral-100"
            >
              Đăng ký partner
              <span className="grid h-[clamp(10px,1.43cqw,16px)] w-[clamp(10px,1.43cqw,16px)] place-items-center rounded-full bg-black text-white">
                <ArrowUpRight className="h-[clamp(8px,1.07cqw,12px)] w-[clamp(8px,1.07cqw,12px)] stroke-[3]" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
