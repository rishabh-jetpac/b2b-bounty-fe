import axios from 'axios'
import { BASE_URL } from '../../../../contants'
import { apiClient } from '../../../lib/api/client'
import type {
  ChangePasswordRequest,
  CreateSubadminRequest,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types'

const ENTERPRISE_REGISTER_ENDPOINT = `${BASE_URL}/auth/register`
const ENTERPRISE_REFRESH_ENDPOINT = `${BASE_URL}/auth/refresh`

export async function login(request: LoginRequest) {
  const response = await apiClient.post<LoginResponse>('auth/login', request)
  return response.data
}

export async function refreshAccessToken(request: RefreshRequest) {
  const response = await axios.post<RefreshResponse>(ENTERPRISE_REFRESH_ENDPOINT, request, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response.data
}

export async function register(request: RegisterRequest) {
  const response = await apiClient.post<RegisterResponse>(ENTERPRISE_REGISTER_ENDPOINT, request)
  return response.data
}

export async function createSubadmin(request: CreateSubadminRequest) {
  await apiClient.post('auth/sub-admins', request)
}

export async function changePassword(request: ChangePasswordRequest) {
  await apiClient.post('auth/change-password', request)
}
