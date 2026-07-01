export function DistributionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div className="space-y-3">
          <div className="h-8 w-64 rounded-lg bg-[#282828]" />
          <div className="h-5 w-[420px] max-w-full rounded-lg bg-[#282828]" />
        </div>
        <div className="flex gap-4">
          <div className="h-9 w-36 rounded-lg bg-[#282828]" />
          <div className="h-9 w-32 rounded-lg bg-[#282828]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[150px] rounded-2xl bg-[#282828]" />
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-7 w-44 rounded-lg bg-[#282828]" />
        <div className="h-5 w-[560px] max-w-full rounded-lg bg-[#282828]" />
      </div>

      <div className="rounded-2xl bg-[#171717] p-6">
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[minmax(200px,1.5fr)_repeat(4,minmax(110px,1fr))] gap-4">
              <div className="h-8 rounded-lg bg-[#282828]" />
              <div className="h-8 rounded-lg bg-[#282828]" />
              <div className="h-8 rounded-lg bg-[#282828]" />
              <div className="h-8 rounded-lg bg-[#282828]" />
              <div className="h-8 rounded-lg bg-[#282828]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
