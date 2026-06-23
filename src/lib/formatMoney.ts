export function formatVnd(value?: number | string | null) {
  const parsed = Number(value ?? 0)

  if (!Number.isFinite(parsed)) return '0'

  return parsed.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
}
