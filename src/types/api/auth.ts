export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role?: string
}

export interface LoginUser {
  id: string
  email: string
  fullName: string
  role: string
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
