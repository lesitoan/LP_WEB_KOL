import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface PageLoadingProps {
  className?: string
}

export function PageLoading({ className }: PageLoadingProps) {
  return (
    <div className={cn('flex min-h-[60vh] items-center justify-center text-primary', className)}>
      <Spinner className="h-10 w-10" />
    </div>
  )
}
