import { jwtDecode } from 'jwt-decode'
import type { AuthUser } from '../types'

type JwtClaims = {
  email?: string
  exp?: number
  iat?: number
  org_id?: string
  org_name?: string
  role?: string
  user_id?: string
}

export function decodeAuthToken(accessToken: string): AuthUser | null {
  try {
    const claims = jwtDecode<JwtClaims>(accessToken)

    if (
      !claims.user_id ||
      !claims.org_id ||
      !claims.role ||
      !claims.email ||
      !claims.org_name ||
      !claims.exp
    ) {
      return null
    }

    if (claims.exp * 1000 <= Date.now()) {
      return null
    }

    return {
      email: claims.email,
      exp: claims.exp,
      orgId: claims.org_id,
      orgName: claims.org_name,
      role: claims.role,
      userId: claims.user_id,
    }
  } catch {
    return null
  }
}
