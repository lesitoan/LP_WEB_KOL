export type GroupLogoKey = 'group_logo_1' | 'group_logo_2' | 'group_logo_3'

type GroupLogoOption = {
  key: GroupLogoKey
  label: string
  src: string
}

export const DEFAULT_GROUP_LOGO_KEY: GroupLogoKey = 'group_logo_1'

export const GROUP_LOGO_OPTIONS: GroupLogoOption[] = [
  {
    key: 'group_logo_1',
    label: 'Logo 1',
    src: '/images/group_logo/group_logo_1.png',
  },
  {
    key: 'group_logo_2',
    label: 'Logo 2',
    src: '/images/group_logo/group_logo_2.png',
  },
  {
    key: 'group_logo_3',
    label: 'Logo 3',
    src: '/images/group_logo/group_logo_3.png',
  },
]

const groupLogoByKey = GROUP_LOGO_OPTIONS.reduce<Record<string, GroupLogoOption>>((accumulator, option) => {
  accumulator[option.key] = option
  return accumulator
}, {})

export function getGroupLogoOption(iconKey?: string | null) {
  if (!iconKey) {
    return groupLogoByKey[DEFAULT_GROUP_LOGO_KEY]
  }

  return groupLogoByKey[iconKey] ?? groupLogoByKey[DEFAULT_GROUP_LOGO_KEY]
}

export function getGroupLogoSrc(iconKey?: string | null) {
  return getGroupLogoOption(iconKey).src
}
