import axios, { AxiosHeaders } from 'axios'
import { clearAuthSession, getAccessToken } from '../../store/authStore'

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '') ?? ''
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    const authorizationHeader = `Bearer ${accessToken}`

    if (config.headers && 'set' in config.headers) {
      config.headers.set('Authorization', authorizationHeader)
    } else {
      config.headers = AxiosHeaders.from(config.headers)
      config.headers.set('Authorization', authorizationHeader)
    }
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? ''
      const isAuthRequest =
        requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register')

      if (!isAuthRequest) {
        clearAuthSession()
      }
    }

    return Promise.reject(error)
  },
)
