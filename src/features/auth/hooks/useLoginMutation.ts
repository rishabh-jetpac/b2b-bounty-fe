import { useMutation } from '@tanstack/react-query'
import { login } from '../services/authService'
import { useAuthStore } from '../../../store/authStore'
import { createAuthSessionFromResponse } from '../utils/authSession'

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: async (emailAndPassword: { email: string; password: string }) => {
      const response = await login(emailAndPassword)
      setSession(createAuthSessionFromResponse(response))

      return response
    },
  })
}
