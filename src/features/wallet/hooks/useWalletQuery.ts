import { useQuery } from '@tanstack/react-query'
import { getWallet } from '../services/walletService'

type UseWalletQueryOptions = {
  enabled?: boolean
}

export function useWalletQuery({ enabled = true }: UseWalletQueryOptions = {}) {
  return useQuery({
    enabled,
    queryKey: ['wallet'],
    queryFn: getWallet,
    retry: false,
    staleTime: 60 * 1000,
  })
}
