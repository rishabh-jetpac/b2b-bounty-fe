import { jwtDecode } from 'jwt-decode'
import type { AuthSession, AuthUser } from '../types'

type JwtClaims = {
  email?: string
  exp?: number
  iat?: number
  organization_id?: string
  organization_type?: string
  org_id?: string
  org_name?: string
  role?: string
  session_id?: string
  user_id?: string
  user_scope?: string
}

export function buildAuthSessionFromToken(accessToken: string): AuthSession | null {
  try {
    const claims = jwtDecode<JwtClaims>(accessToken)
    const orgId = claims.organization_id ?? claims.org_id

    if (
      !claims.user_id ||
      !orgId ||
      !claims.role ||
      !claims.email ||
      !claims.exp
    ) {
      return null
    }

    if (claims.exp * 1000 <= Date.now()) {
      return null
    }

    return {
      accessToken,
      accessTokenExpiresAt: new Date(claims.exp * 1000).toISOString(),
      refreshToken: null,
      refreshTokenExpiresAt: null,
      user: {
        email: claims.email,
        exp: claims.exp,
        orgId,
        orgName: claims.org_name,
        role: claims.role,
        userId: claims.user_id,
      },
    }
  } catch {
    return null
  }
}

export function decodeAuthToken(accessToken: string): AuthUser | null {
  return buildAuthSessionFromToken(accessToken)?.user ?? null
}
