import type { AuthSession, AuthTokenResponse } from '../types'

export function createAuthSessionFromResponse(response: AuthTokenResponse): AuthSession {
  const issuedAt = Date.parse(response.timestamp)
  const expiresAtMs =
    (Number.isFinite(issuedAt) ? issuedAt : Date.now()) + response.data.expires_in * 1000

  return {
    accessToken: response.data.access_token,
    accessTokenExpiresAt: new Date(expiresAtMs).toISOString(),
    refreshToken: response.data.refresh_token,
    refreshTokenExpiresAt: response.data.refresh_token_expires_at,
    user: {
      email: response.data.email,
      exp: Math.floor(expiresAtMs / 1000),
      orgId: response.data.organization_id,
      role: response.data.role,
      userId: response.data.user_id,
    },
  }
}
