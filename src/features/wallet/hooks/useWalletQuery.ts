import { useQuery } from '@tanstack/react-query'
import { getWallet } from '../services/walletService'

export function useWalletQuery() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: getWallet,
    retry: false,
    staleTime: 60 * 1000,
  })
}
