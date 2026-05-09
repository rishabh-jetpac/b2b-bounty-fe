import { create } from 'zustand'
import { appQueryClient } from '../app/queryClient'
import { decodeAuthToken } from '../features/auth/authToken'
import type { AuthUser } from '../features/auth/types'

const accessTokenStorageKey = 'jetpac.accessToken'

type AuthState = {
  accessToken: string | null
  hydrated: boolean
  initializeAuth: () => void
  setSessionFromToken: (accessToken: string) => boolean
  clearSession: () => void
  user: AuthUser | null
}

function persistAccessToken(accessToken: string) {
  window.localStorage.setItem(accessTokenStorageKey, accessToken)
}

function readPersistedAccessToken() {
  return window.localStorage.getItem(accessTokenStorageKey)
}

function clearPersistedAccessToken() {
  window.localStorage.removeItem(accessTokenStorageKey)
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  hydrated: false,
  initializeAuth: () => {
    const persistedAccessToken = readPersistedAccessToken()

    if (!persistedAccessToken) {
      set({
        accessToken: null,
        hydrated: true,
        user: null,
      })
      return
    }

    const user = decodeAuthToken(persistedAccessToken)

    if (!user) {
      clearPersistedAccessToken()
      set({
        accessToken: null,
        hydrated: true,
        user: null,
      })
      return
    }

    set({
      accessToken: persistedAccessToken,
      hydrated: true,
      user,
    })
  },
  setSessionFromToken: (accessToken) => {
    const user = decodeAuthToken(accessToken)

    if (!user) {
      clearPersistedAccessToken()
      set({
        accessToken: null,
        hydrated: true,
        user: null,
      })
      return false
    }

    persistAccessToken(accessToken)
    set({
      accessToken,
      hydrated: true,
      user,
    })
    return true
  },
  clearSession: () => {
    clearPersistedAccessToken()
    set({
      accessToken: null,
      hydrated: true,
      user: null,
    })
  },
  user: null,
}))

export function getAccessToken() {
  return useAuthStore.getState().accessToken
}

export function clearAuthSession() {
  useAuthStore.getState().clearSession()
  appQueryClient.clear()
}
