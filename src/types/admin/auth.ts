export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminProfile {
  id: string
  email: string
  name: string
  role?: string
  twoFactorEnabled?: boolean
}

export interface AdminLoginResult {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    fullName: string
    role?: string
    twoFactorEnabled?: boolean
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
