export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminProfile {
  id: string
  email: string
  name: string
  role?: string
  status?: string
  lastLoginAt?: string | null
  twoFactorEnabled?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AdminUserApiData {
  id: string
  email: string
  fullName: string | null
  role?: string
  status?: string
  lastLoginAt?: string | null
  twoFactorEnabled?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AdminPermissionProfile {
  [key: string]: unknown
}

export interface AdminMeResult {
  user: AdminUserApiData
  permissionProfile?: AdminPermissionProfile | null
}

export interface AdminLoginResult {
  accessToken: string
  refreshToken: string
  user: AdminUserApiData & {
    permissionProfile?: AdminPermissionProfile | null
  }
}

export interface AdminLoginResponse {
  accessToken: string
  refreshToken: string
  user: AdminProfile
}

export interface AdminTwoFactorChallenge {
  requiresTwoFactor: true
  twoFactorMethod: 'totp'
  challengeToken: string
  expiresIn: number
}

export type AdminLoginAttemptResponse = AdminLoginResponse | AdminTwoFactorChallenge

export interface AdminVerifyTwoFactorRequest {
  challengeToken: string
  code: string
}

export interface AdminTwoFactorCodeRequest {
  code: string
}

export interface AdminTwoFactorSetupResult {
  enabled: boolean
  manualEntryKey: string
  otpauthUrl: string
  issuer: string
  accountName: string
}

export interface AdminTwoFactorStatusResult {
  enabled: boolean
}
