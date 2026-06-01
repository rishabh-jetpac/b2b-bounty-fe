export type AuthUser = {
  email: string
  exp: number
  orgId: string
  orgName?: string
  role: string
  userId: string
}

export type AuthSession = {
  accessToken: string
  accessTokenExpiresAt: string
  refreshToken: string | null
  refreshTokenExpiresAt: string | null
  user: AuthUser
}

export type AuthTokenPayload = {
  access_token: string
  email: string
  expires_in: number
  organization_id: string
  refresh_token: string
  refresh_token_expires_at: string
  role: string
  session_id: string
  token_type: string
  user_id: string
  user_scope: string
}

export type AuthTokenResponse = {
  data: AuthTokenPayload
  error: string
  message: string
  status: string
  status_code: number
  timestamp: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = AuthTokenResponse

export type RefreshRequest = {
  refresh_token: string
}

export type RefreshResponse = AuthTokenResponse

export type RegisterRequest = {
  email: string
  org_name: string
  password: string
}

export type CreateSubadminRequest = {
  email: string
  password: string
}

export type RegisterResponse = {
  data?: {
    message?: string
    token?: string
  }
}
