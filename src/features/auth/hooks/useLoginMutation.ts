import { useMutation } from '@tanstack/react-query'
import { login } from '../services/authService'
import { useAuthStore } from '../../../store/authStore'

export function useLoginMutation() {
  const setSessionFromToken = useAuthStore((state) => state.setSessionFromToken)

  return useMutation({
    mutationFn: async (emailAndPassword: { email: string; password: string }) => {
      const response = await login(emailAndPassword)
      const didPersistSession = setSessionFromToken(response.data.token)

      if (!didPersistSession) {
        throw new Error('The login token could not be processed.')
      }

      return response
    },
  })
}
