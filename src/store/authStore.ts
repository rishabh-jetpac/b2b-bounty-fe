import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { appQueryClient } from '../app/queryClient'
import type { AuthSession, AuthUser } from '../features/auth/types'
import { decodeAuthToken } from '../features/auth/utils/authToken'

const authStorageKey = 'jetpac.auth'
const legacyAccessTokenStorageKey = 'jetpac.accessToken'

type AuthState = {
  accessToken: string | null
  accessTokenExpiresAt: string | null
  refreshToken: string | null
  refreshTokenExpiresAt: string | null
  hydrated: boolean
  initializeAuth: () => void
  setSession: (session: AuthSession) => void
  clearSession: () => void
  user: AuthUser | null
}

function clearLegacyAccessToken() {
  window.localStorage.removeItem(legacyAccessTokenStorageKey)
}

function hasValidSession(
  accessToken: string | null,
  accessTokenExpiresAt: string | null,
  refreshToken: string | null,
  refreshTokenExpiresAt: string | null,
  user: AuthUser | null,
) {
  if (!accessToken || !user) {
    return false
  }

  const accessTokenIsValid = hasValidTimestamp(accessTokenExpiresAt)
  const refreshTokenIsValid = refreshToken ? hasValidTimestamp(refreshTokenExpiresAt) : false

  return accessTokenIsValid || refreshTokenIsValid
}

function hasValidTimestamp(value: string | null) {
  if (!value) {
    return false
  }

  const timestamp = Date.parse(value)

  return Number.isFinite(timestamp) && timestamp > Date.now()
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      accessTokenExpiresAt: null,
      refreshToken: null,
      refreshTokenExpiresAt: null,
      hydrated: false,
      initializeAuth: () => {
        clearLegacyAccessToken()

        const { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, user } = get()

        if (
          hasValidSession(
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            user,
          )
        ) {
          const decodedUser = accessToken ? decodeAuthToken(accessToken) : null

          set({
            hydrated: true,
            user: decodedUser ? { ...user, ...decodedUser } : user,
          })
          return
        }

        set({
          accessToken: null,
          accessTokenExpiresAt: null,
          refreshToken: null,
          refreshTokenExpiresAt: null,
          hydrated: true,
          user: null,
        })
      },
      setSession: ({
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
        user,
      }) => {
        set({
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
          hydrated: true,
          user,
        })
      },
      clearSession: () => {
        set({
          accessToken: null,
          accessTokenExpiresAt: null,
          refreshToken: null,
          refreshTokenExpiresAt: null,
          hydrated: true,
          user: null,
        })
      },
      user: null,
    }),
    {
      name: authStorageKey,
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        accessTokenExpiresAt: state.accessTokenExpiresAt,
        refreshToken: state.refreshToken,
        refreshTokenExpiresAt: state.refreshTokenExpiresAt,
        user: state.user,
      }),
    },
  ),
)

export function getAccessToken() {
  return useAuthStore.getState().accessToken
}

export function getAuthSessionSnapshot() {
  const {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    user,
  } = useAuthStore.getState()

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    user,
  }
}

export function setAuthSession(session: AuthSession) {
  useAuthStore.getState().setSession(session)
}

export function clearAuthSession() {
  useAuthStore.getState().clearSession()
  appQueryClient.clear()
}
