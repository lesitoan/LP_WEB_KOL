export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminProfile {
  id: string
  email: string
  name: string
  role?: string
}

export interface AdminLoginResult {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    fullName: string
    role?: string
  }
}

export interface AdminLoginResponse {
  accessToken: string
  refreshToken: string
  user: AdminProfile
}
