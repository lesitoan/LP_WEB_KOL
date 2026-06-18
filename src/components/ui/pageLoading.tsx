import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface PageLoadingProps {
  className?: string
}

export function PageLoading({ className }: PageLoadingProps) {
  return (
    <div className={cn('flex min-h-screen items-center justify-center bg-background', className)}>
      <Spinner className="h-16 w-16 drop-shadow-[0_0_32px_hsl(var(--brand)/0.55)]" />
    </div>
  )
}
