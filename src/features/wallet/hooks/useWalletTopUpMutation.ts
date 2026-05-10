import { useMutation, useQueryClient } from '@tanstack/react-query'
import { topUpWallet } from '../services/walletService'
import type { WalletTopUpRequest } from '../types'

export function useWalletTopUpMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: WalletTopUpRequest) => topUpWallet(request),
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['wallet'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['wallet', 'transactions'],
        }),
      ])
    },
  })
}
