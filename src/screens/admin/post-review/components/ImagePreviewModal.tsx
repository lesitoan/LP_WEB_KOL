"use client"

import * as React from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Keyboard, Navigation, Zoom } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/zoom'

interface ImagePreviewModalProps {
  images: string[]
  initialIndex: number
  title: string
  onClose: () => void
}

export default function ImagePreviewModal({
  images,
  initialIndex,
  title,
  onClose,
}: ImagePreviewModalProps) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (typeof document === 'undefined' || images.length === 0) return null

  return createPortal((
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[30000] bg-black/90 text-white animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            swiper?.zoom.out()
          }}
          className="grid h-10 min-w-10 place-items-center rounded-full border border-white/15 bg-[#171717]/90 px-3 text-lg font-semibold transition-colors hover:bg-[#282828]"
          aria-label="Thu nhỏ ảnh"
        >
          -
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            swiper?.zoom.in()
          }}
          className="grid h-10 min-w-10 place-items-center rounded-full border border-white/15 bg-[#171717]/90 px-3 text-lg font-semibold transition-colors hover:bg-[#282828]"
          aria-label="Phóng to ảnh"
        >
          +
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onClose()
          }}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[#171717]/90 transition-colors hover:bg-[#282828]"
          aria-label="Đóng xem ảnh"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-[#171717]/80 px-3 py-1 text-xs text-[#D7D8D9]">
        Kéo để di chuyển ảnh sau khi zoom
      </div>

      <div className="h-full w-full" onClick={(event) => event.stopPropagation()}>
        <Swiper
          key={`preview-${initialIndex}-${images.length}`}
          modules={[Keyboard, Navigation, Zoom]}
          initialSlide={initialIndex}
          keyboard={{ enabled: true }}
          navigation
          zoom={{ maxRatio: 5, minRatio: 1 }}
          onSwiper={setSwiper}
          onSlideChange={(nextSwiper) => nextSwiper.zoom.out()}
          className="h-full w-full"
          style={{
            '--swiper-navigation-color': '#F7F0A1',
          } as React.CSSProperties}
        >
          {images.map((url, index) => (
            <SwiperSlide key={`preview-${url}-${index}`} className="h-full w-full">
              <div className="swiper-zoom-container h-full w-full">
                <img
                  src={url}
                  alt={`${title} ${index + 1}`}
                  className="max-h-[92dvh] max-w-[92vw] object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  ), document.body)
}
