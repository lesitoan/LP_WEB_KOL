export type InsightCategory =
  | 'market'
  | 'onchain'
  | 'risk'
  | 'narrative'
  | 'research'

export type Insight = {
  id: string
  category: InsightCategory
  title: string
  risk: string
  dataPoint: string
  context: string
}

export type InsightTab = {
  id: InsightCategory
  label: string
}
