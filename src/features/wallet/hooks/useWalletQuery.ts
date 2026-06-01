import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { getWallet } from '../services/walletService'

type UseWalletQueryOptions = {
  enabled?: boolean
}

export function useWalletQuery({ enabled = true }: UseWalletQueryOptions = {}) {
  const baseCurrency = useAuthStore((state) => state.user?.baseCurrency)

  return useQuery({
    enabled,
    queryKey: ['wallet', baseCurrency ?? ''],
    queryFn: () => getWallet(baseCurrency),
    retry: false,
    staleTime: 60 * 1000,
  })
}
