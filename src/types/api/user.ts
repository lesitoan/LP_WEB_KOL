export interface UserProfile {
  id: string
  email: string
  name: string
  role?: string
  twoFactorEnabled?: boolean
  status?: string
  avatarUrl?: string
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string
  tier?: string
  referralCode?: string
  referralLink?: string
  kolId?: string
  kolCode?: string
  kolDisplayName?: string
  lpexUid?: string
  lpexRefCode?: string
  telegramContact?: string
  zaloContact?: string
  defaultLanguage?: string
  telegramUsername?: string
}
