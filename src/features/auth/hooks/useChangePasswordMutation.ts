import { useMutation } from '@tanstack/react-query'
import { changePassword } from '../services/authService'
import type { ChangePasswordRequest } from '../types'

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (request: ChangePasswordRequest) => changePassword(request),
  })
}
