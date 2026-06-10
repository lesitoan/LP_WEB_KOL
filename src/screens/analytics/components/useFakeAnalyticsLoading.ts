import { useEffect, useState } from "react"

export function useFakeAnalyticsLoading(delay = 3000) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, delay)

    return () => {
      window.clearTimeout(timer)
    }
  }, [delay])

  return isLoading
}
