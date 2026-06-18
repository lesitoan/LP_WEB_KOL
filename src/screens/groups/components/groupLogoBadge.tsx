import { getGroupLogoSrc } from '@/lib/groupLogo'

type GroupLogoBadgeProps = {
  iconKey?: string | null
  title?: string | null
  className?: string
  textClassName?: string
}

function getGroupInitial(title?: string | null) {
  const normalizedTitle = title?.trim()
  return normalizedTitle ? normalizedTitle.charAt(0).toUpperCase() : 'G'
}

export function GroupLogoBadge({ iconKey, title, className = 'h-9 w-10', textClassName = 'text-base' }: GroupLogoBadgeProps) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
      <img src={getGroupLogoSrc(iconKey)} alt="" className="h-full w-full object-contain" />
      <span className={`absolute inset-x-0 top-[24%] text-center font-bold leading-none text-[#262626] ${textClassName}`}>
        {getGroupInitial(title)}
      </span>
    </span>
  )
}
