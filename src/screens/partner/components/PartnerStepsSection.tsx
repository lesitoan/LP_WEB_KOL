import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { PartnerStep } from '../constants'

type PartnerStepsSectionProps = {
  steps: PartnerStep[]
}

export default function PartnerStepsSection({ steps }: PartnerStepsSectionProps) {
  return (
    <section className="mx-auto max-w-[1320px] px-5">
      <h2 className="text-center text-6xl font-semibold max-lg:text-5xl max-md:text-4xl">Đơn giản để bắt đầu</h2>
      <div className="mt-10 grid gap-16 md:grid-cols-[1fr_0.9fr] md:items-center">
        <div className="relative overflow-hidden rounded-xl border border-[#d8cf73]/45 bg-[#151515] p-6 shadow-lg">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-cover bg-top bg-no-repeat opacity-70"
            style={{ backgroundImage: 'url("/images/partner/Ellipse.png")' }}
          />
          {steps.map((step) => {
            const [stepLabel, ...titleParts] = step.title.split(':')
            const title = titleParts.join(':').trim()

            return (
              <div
                key={step.title}
                className="group/step relative z-10 flex gap-4 border-b border-white/15 py-5 first:pt-0 last:border-b-0 last:pb-0 transition-all duration-300 hover:translate-x-1"
              >
                <img
                  src={step.icon}
                  alt=""
                  className="h-[60px] w-[60px] shrink-0 object-contain transition-transform duration-300 group-hover/step:scale-110"
                />
                <div>
                  <h3 className="text-xl max-md:text-lg font-medium ransition-colors duration-300">
                    <span className="text-brand group-hover/step:text-brand-bright">{stepLabel}:</span>{' '}
                    <span className="text-white">{title}</span>
                  </h3>
                  <p className="mt-1 text-xl max-md:text-base font-normal leading-5 text-[#bdbdbd]">{step.body}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div>
          <h3 className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-[40px] max-lg:text-2xl font-medium leading-tight text-transparent">
            Chỉ cần bắt đầu từ con số 0
            <br />
            Vẫn có ngay <span className="font-semibold bg-[linear-gradient(90deg,#FFF6B8_0%,#FFFFFF_58%,#E8C878_100%)] bg-clip-text text-transparent" >30% hoa hồng</span>
          </h3>
          <p className="mt-5 text-2xl max-lg:text-xl font-normal eading-6 text-[#bdbdbd]">
            Bạn chưa cần cộng đồng lớn hay điều kiện nào. Đăng ký, mời bạn bè, rồi leo hạng dần - hoa hồng tăng theo quy mô.
          </p>
          <Link
            href="/login"
            className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand px-6 text-base font-semibold text-primary-foreground shadow-[0_4px_20px_rgba(247,240,161,0.15)] transition-all duration-300 hover:scale-[1.01] hover:bg-brand-bright"
          >
            ĐĂNG KÝ NGAY - HOA HỒNG LIỀN TAY
            <span className="grid h-4 w-4 place-items-center rounded-full bg-black text-brand">
              <ArrowUpRight className="h-3 w-3 stroke-[3]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
