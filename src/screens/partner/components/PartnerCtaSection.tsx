import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function PartnerCtaSection() {
  return (
    <section className="mx-auto max-w-[1320px] px-3 pb-12 pt-2 animate-fade-in sm:px-5">
      <div className="relative aspect-[1120/398] w-full max-w-full overflow-hidden rounded-xl bg-[url('/images/partner/CTA_bg.png')] bg-cover bg-center px-[clamp(10px,4.3vw,48px)] pb-[clamp(10px,2.9vw,32px)] pt-[clamp(10px,2.9vw,32px)] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
        <div className="pointer-events-none absolute inset-x-[clamp(12px,3.6vw,40px)] top-0 h-[24%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.42),transparent_70%)]" />

        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Sẵn sàng biến cộng đồng thành thu nhập bền vững?
          </h2>
          <p className="mt-[clamp(2px,0.7vw,8px)] text-3xl font-medium leading-tight text-white">
            Tham gia chương trình Partner SCEX ngay hôm nay
          </p>
        </div>

        <div className="relative z-10 mx-[clamp(2px,0.8vw,9px)] mt-[clamp(8px,2.7vw,30px)] aspect-[1006/234] overflow-hidden rounded-lg">
          <Image
            src="/images/partner/CTA_banner.png"
            alt="Partner SCEX"
            fill
            sizes="(max-width: 768px) calc(100vw - 24px), 1024px"
            quality={100}
            className="object-cover object-top"
          />
          <Link
            href="/login"
            className="absolute left-1/2 top-[13%] inline-flex -translate-x-1/2 items-center gap-1.5 rounded-md bg-white px-2 py-1 text-[8px] font-bold text-black shadow-[0_4px_25px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:bg-neutral-100 sm:gap-2 sm:px-4 sm:py-2 sm:text-xs"
          >
            Đăng ký partner
            <span className="grid h-3 w-3 place-items-center rounded-full bg-black text-white sm:h-4 sm:w-4">
              <ArrowUpRight className="h-2.5 w-2.5 stroke-[3] sm:h-3 sm:w-3" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
