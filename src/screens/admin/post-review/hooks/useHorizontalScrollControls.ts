import { useCallback, useEffect, useRef, useState, type DependencyList, type MutableRefObject } from 'react'

interface ArrowState {
  left: boolean
  right: boolean
}

function getArrowState(element: HTMLElement | null): ArrowState {
  if (!element) return { left: false, right: false }
  const { scrollLeft, scrollWidth, clientWidth } = element
  return {
    left: scrollLeft > 0,
    right: scrollLeft + clientWidth < scrollWidth - 4,
  }
}

function scrollByItem(
  container: HTMLElement | null,
  direction: 'left' | 'right',
  targetRef: MutableRefObject<number | null>
) {
  if (!container) return

  const firstItem = container.firstElementChild as HTMLElement | null
  const gap = Number.parseFloat(window.getComputedStyle(container).columnGap || '0')
  const step = firstItem ? firstItem.clientWidth + gap : container.clientWidth

  if (targetRef.current === null) {
    targetRef.current = container.scrollLeft
  }

  targetRef.current += direction === 'right' ? step : -step

  const maxScroll = container.scrollWidth - container.clientWidth
  targetRef.current = Math.max(0, Math.min(maxScroll, targetRef.current))

  container.scrollTo({
    left: targetRef.current,
    behavior: 'smooth',
  })
}

export function useHorizontalScrollControls(deps: DependencyList = []) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollTargetRef = useRef<number | null>(null)
  const [arrows, setArrows] = useState<ArrowState>({ left: false, right: false })

  const updateArrows = useCallback(() => {
    setArrows(getArrowState(scrollRef.current))
  }, [])

  const scrollLeft = () => scrollByItem(scrollRef.current, 'left', scrollTargetRef)
  const scrollRight = () => scrollByItem(scrollRef.current, 'right', scrollTargetRef)

  useEffect(() => {
    const timer = setTimeout(updateArrows, 120)
    return () => clearTimeout(timer)
  }, [updateArrows, ...deps])

  useEffect(() => {
    const handleResize = () => {
      scrollTargetRef.current = null
      updateArrows()
    }

    const timer = setTimeout(handleResize, 120)
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateArrows])

  return {
    scrollRef,
    arrows,
    updateArrows,
    scrollLeft,
    scrollRight,
  }
}
