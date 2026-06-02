export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role?: string
  twoFactorEnabled?: boolean
}

export interface LoginUser {
  id: string
  email: string
  fullName: string
  role: string
  twoFactorEnabled?: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: LoginUser
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser
}

export interface TwoFactorChallenge {
  requiresTwoFactor: true
  twoFactorMethod: 'totp'
  challengeToken: string
  expiresIn: number
}

export type LoginAttemptResponse = LoginResponse | TwoFactorChallenge

export interface VerifyTwoFactorRequest {
  challengeToken: string
  code: string
}

export interface TwoFactorCodeRequest {
  code: string
}

export interface TwoFactorSetupResult {
  enabled: boolean
  manualEntryKey: string
  otpauthUrl: string
  issuer: string
  accountName: string
}

export interface TwoFactorStatusResult {
  enabled: boolean
}

export interface RefreshResponse {
  accessToken: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface ChangePasswordData {
  message: string
}
