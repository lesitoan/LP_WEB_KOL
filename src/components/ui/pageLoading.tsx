import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface PageLoadingProps {
  className?: string
}

export function PageLoading({ className }: PageLoadingProps) {
  return (
    <div className={cn('flex min-h-[60vh] items-center justify-center text-[hsl(40_78%_55%)]', className)}>
      <Spinner className="h-16 w-16 drop-shadow-[0_0_32px_hsl(40_78%_55%/0.6)]" />
    </div>
  )
}
