import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { register } from '../services/authService'
import type { RegisterRequest } from '../types'

export function useRegisterMutation() {
  const setSessionFromToken = useAuthStore((state) => state.setSessionFromToken)

  return useMutation({
    mutationFn: async (registration: RegisterRequest) => {
      const response = await register(registration)
      const accessToken = response.data?.token

      if (accessToken) {
        const didPersistSession = setSessionFromToken(accessToken)

        if (!didPersistSession) {
          throw new Error('The registration token could not be processed.')
        }
      }

      return response
    },
  })
}
