import type { AuthSession, AuthTokenResponse } from '../types'
import { buildAuthUserName } from './authUser'

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
      baseCurrency: response.data.base_currency,
      email: response.data.email,
      exp: Math.floor(expiresAtMs / 1000),
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      name: buildAuthUserName(response.data.first_name, response.data.last_name),
      orgId: response.data.organization_id,
      orgName: response.data.org_name,
      role: response.data.role,
      userId: response.data.user_id,
    },
  }
}
