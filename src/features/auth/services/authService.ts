import { apiClient } from '../../../lib/api/client'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types'

export async function login(request: LoginRequest) {
  const response = await apiClient.post<LoginResponse>('/auth/login', request)
  return response.data
}

export async function register(request: RegisterRequest) {
  const response = await apiClient.post<RegisterResponse>('/auth/register', request)
  return response.data
}
