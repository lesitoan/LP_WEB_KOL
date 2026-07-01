import type {
  AdminDistributionConfig,
  AdminDistributionContentTypeConfig,
  DistributionTierCode,
  UpdateAdminDistributionConfigBody,
  UpdateAdminDistributionContentTypeConfigBodyItem,
} from '@/types/api/adminDistributionConfig'
import type { ContentTypeCode } from '@/types/api/adminInsight'

export type TierId = 'starter' | 'partner' | 'elite' | 'legend'

export interface TierConfig {
  id: TierId
  tierCode: DistributionTierCode
  label: string
  range: string
  kolCount?: number | null
  offsetMinutes: number
  commission: number
  icon: string
}

export interface NewsTypeRow {
  id: ContentTypeCode
  name: string
  subtext: string
  enabled: Record<TierId, boolean>
}

export interface NewsCategory {
  id: string
  label: string
  items: NewsTypeRow[]
}

export interface DistributionDraft {
  tiers: TierConfig[]
  categories: NewsCategory[]
  toggles: Record<string, Record<TierId, boolean>>
}

export const TIER_IDS: TierId[] = ['starter', 'partner', 'elite', 'legend']

export const TIER_CODE_BY_ID: Record<TierId, DistributionTierCode> = {
  starter: 'STARTER',
  partner: 'PARTNER',
  elite: 'ELITE',
  legend: 'LEGEND',
}

export const TIER_ID_BY_CODE: Record<DistributionTierCode, TierId> = {
  STARTER: 'starter',
  PARTNER: 'partner',
  ELITE: 'elite',
  LEGEND: 'legend',
}

export const TIER_CARD_ICONS: Record<DistributionTierCode, string> = {
  STARTER: '/images/tier_icons/STARTER_icon_active.svg',
  PARTNER: '/images/tier_icons/PARTNER_icon_active.svg',
  ELITE: '/images/tier_icons/ELITE_icon_active.svg',
  LEGEND: '/images/tier_icons/LEGEND_icon_active.svg',
}

export const TABLE_TIER_ICONS: Record<TierId, string> = {
  starter: '/images/admin/distribution/starter_small_icon.svg',
  partner: '/images/admin/distribution/partner_small_icon.svg',
  elite: '/images/admin/distribution/elite_small_icon.svg',
  legend: '/images/admin/distribution/legend_small_icon.svg',
}

const GROUP_LABELS: Record<string, string> = {
  A: 'A. Tin trong ngày',
  B: 'B. Tin nóng & cảnh báo',
  C: 'C. Whales insights',
  D: 'D. Phân tích thị trường',
  E: 'E. Research & báo cáo',
  daily: 'A. Tin trong ngày',
  alerts: 'B. Tin nóng & cảnh báo',
  whales: 'C. Whales insights',
  market: 'D. Phân tích thị trường',
  research: 'E. Research & báo cáo',
}

const CONTENT_TYPE_ALIAS: Partial<Record<ContentTypeCode, string>> = {
  BAN_TIN_0630: 'ban_tin_0630',
  BAN_TIN_1300: 'ban_tin_1300',
  BAN_TIN_1900: 'ban_tin_1900',
}

function formatHourMinute(hour: number | null, minute: number | null) {
  if (typeof hour !== 'number' || typeof minute !== 'number') return null
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function formatContentTypeSubtext(item: AdminDistributionContentTypeConfig) {
  const codeLabel = CONTENT_TYPE_ALIAS[item.code] ?? item.code.toLowerCase()
  const timeLabel =
    item.defaultTimeLabel ||
    formatHourMinute(item.defaultHour, item.defaultMinute) ||
    (item.defaultScheduleType === 'REALTIME'
      ? 'Realtime'
      : item.defaultScheduleType === 'RELATIVE'
        ? `${item.relativeMinutesMin ?? 0}-${item.relativeMinutesMax ?? 0}'`
        : item.triggerCondition || item.defaultScheduleType)

  return `${codeLabel} · ${timeLabel}`
}

function groupLabel(groupKey: string) {
  return GROUP_LABELS[groupKey] ?? groupKey
}

function cloneToggles(toggles: Record<string, Record<TierId, boolean>>) {
  return Object.fromEntries(
    Object.entries(toggles).map(([rowId, rowToggles]) => [rowId, { ...rowToggles }]),
  ) as Record<string, Record<TierId, boolean>>
}

export function mapDistributionConfigToDraft(config: AdminDistributionConfig): DistributionDraft {
  const tiers = config.tiers.map((tier) => ({
    id: TIER_ID_BY_CODE[tier.tierCode],
    tierCode: tier.tierCode,
    label: tier.tierCode,
    range: tier.memberRangeLabel.replace(/\s*TV$/i, ''),
    kolCount: null,
    offsetMinutes: tier.offsetMinutes,
    commission: tier.commissionRatePct,
    icon: TIER_CARD_ICONS[tier.tierCode],
  }))

  const toggles: Record<string, Record<TierId, boolean>> = {}
  const categoriesByKey = new Map<string, NewsCategory>()

  for (const item of config.contentTypes) {
    const enabled = { ...item.enabledTiers }
    toggles[item.code] = enabled

    const category = categoriesByKey.get(item.groupKey) ?? {
      id: item.groupKey,
      label: groupLabel(item.groupKey),
      items: [],
    }

    category.items.push({
      id: item.code,
      name: item.label,
      subtext: formatContentTypeSubtext(item),
      enabled,
    })

    categoriesByKey.set(item.groupKey, category)
  }

  return {
    tiers,
    categories: Array.from(categoriesByKey.values()),
    toggles,
  }
}

export function cloneDistributionDraft(draft: DistributionDraft): DistributionDraft {
  return {
    tiers: draft.tiers.map((tier) => ({ ...tier })),
    categories: draft.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({ ...item, enabled: { ...item.enabled } })),
    })),
    toggles: cloneToggles(draft.toggles),
  }
}

export function buildDistributionUpdateBody(
  initial: DistributionDraft,
  draft: DistributionDraft,
): UpdateAdminDistributionConfigBody | null {
  const initialTierByCode = new Map(initial.tiers.map((tier) => [tier.tierCode, tier]))
  const tiers = draft.tiers
    .filter((tier) => initialTierByCode.get(tier.tierCode)?.offsetMinutes !== tier.offsetMinutes)
    .map((tier) => ({
      tierCode: tier.tierCode,
      offsetMinutes: tier.offsetMinutes,
    }))

  const contentTypes: UpdateAdminDistributionContentTypeConfigBodyItem[] = []

  for (const [rowId, rowToggles] of Object.entries(draft.toggles)) {
    const initialRowToggles = initial.toggles[rowId]
    if (!initialRowToggles) continue

    const changedItem: UpdateAdminDistributionContentTypeConfigBodyItem = {
      code: rowId as ContentTypeCode,
    }

    for (const tierId of TIER_IDS) {
      if (rowToggles[tierId] !== initialRowToggles[tierId]) {
        if (tierId === 'starter') changedItem.starterEnabled = rowToggles[tierId]
        if (tierId === 'partner') changedItem.partnerEnabled = rowToggles[tierId]
        if (tierId === 'elite') changedItem.eliteEnabled = rowToggles[tierId]
        if (tierId === 'legend') changedItem.legendEnabled = rowToggles[tierId]
      }
    }

    if (Object.keys(changedItem).length > 1) {
      contentTypes.push(changedItem)
    }
  }

  const body: UpdateAdminDistributionConfigBody = {}
  if (tiers.length > 0) body.tiers = tiers
  if (contentTypes.length > 0) body.contentTypes = contentTypes

  return body.tiers || body.contentTypes ? body : null
}
