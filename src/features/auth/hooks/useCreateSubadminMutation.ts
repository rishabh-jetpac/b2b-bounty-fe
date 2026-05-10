import { useMutation } from '@tanstack/react-query'
import { createSubadmin } from '../services/authService'
import type { CreateSubadminRequest } from '../types'

export function useCreateSubadminMutation() {
  return useMutation({
    mutationFn: async (request: CreateSubadminRequest) => {
      await createSubadmin(request)
    },
  })
}
