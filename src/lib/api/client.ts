import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { refreshAccessToken } from '../../features/auth/services/authService'
import { createAuthSessionFromResponse } from '../../features/auth/utils/authSession'
import {
  clearAuthSession,
  getAccessToken,
  getAuthSessionSnapshot,
  setAuthSession,
} from '../../store/authStore'

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '') ?? ''
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshAccessTokenPromise: Promise<string> | null = null

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

function isAuthRequest(url: string) {
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh')
  )
}

function hasValidTimestamp(value: string | null) {
  if (!value) {
    return false
  }

  const timestamp = Date.parse(value)

  return Number.isFinite(timestamp) && timestamp > Date.now()
}

async function getRefreshedAccessToken() {
  const { refreshToken, refreshTokenExpiresAt } = getAuthSessionSnapshot()

  if (!refreshToken || !hasValidTimestamp(refreshTokenExpiresAt)) {
    clearAuthSession()
    throw new Error('Authentication session expired.')
  }

  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = refreshAccessToken({
      refresh_token: refreshToken,
    })
      .then((response) => {
        const session = createAuthSessionFromResponse(response)
        setAuthSession(session)
        return session.accessToken
      })
      .catch((error) => {
        clearAuthSession()
        throw error
      })
      .finally(() => {
        refreshAccessTokenPromise = null
      })
  }

  return refreshAccessTokenPromise
}

function setAuthorizationHeader(config: InternalAxiosRequestConfig, accessToken: string) {
  const authorizationHeader = `Bearer ${accessToken}`

  if (config.headers && 'set' in config.headers) {
    config.headers.set('Authorization', authorizationHeader)
  } else {
    config.headers = AxiosHeaders.from(config.headers)
    config.headers.set('Authorization', authorizationHeader)
  }
}

apiClient.interceptors.request.use((config) => {
  if (isAuthRequest(config.url ?? '')) {
    return config
  }

  const accessToken = getAccessToken()

  if (accessToken) {
    setAuthorizationHeader(config, accessToken)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestConfig = error.config as RetryableRequestConfig | undefined
      const requestUrl = requestConfig?.url ?? ''

      if (!requestConfig) {
        clearAuthSession()
        return Promise.reject(error)
      }

      if (requestConfig._retry || isAuthRequest(requestUrl)) {
        return Promise.reject(error)
      }

      requestConfig._retry = true

      try {
        const accessToken = await getRefreshedAccessToken()
        setAuthorizationHeader(requestConfig, accessToken)
        return apiClient(requestConfig)
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)
