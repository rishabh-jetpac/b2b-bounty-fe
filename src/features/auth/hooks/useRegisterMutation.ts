import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { register } from '../services/authService'
import type { RegisterRequest } from '../types'
import { buildAuthSessionFromToken } from '../utils/authToken'

export function useRegisterMutation() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: async (registration: RegisterRequest) => {
      const response = await register(registration)
      const accessToken = response.data?.token

      if (accessToken) {
        const session = buildAuthSessionFromToken(accessToken)

        if (!session) {
          throw new Error('The registration token could not be processed.')
        }

        setSession(session)
      }

      return response
    },
  })
}
