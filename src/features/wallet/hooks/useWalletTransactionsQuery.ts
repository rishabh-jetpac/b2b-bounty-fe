import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { getWalletTransactions } from '../services/walletService'

export function useWalletTransactionsQuery() {
  const baseCurrency = useAuthStore((state) => state.user?.baseCurrency)

  return useQuery({
    queryKey: ['wallet', 'transactions', baseCurrency ?? ''],
    queryFn: () => getWalletTransactions(baseCurrency),
    retry: false,
    staleTime: 60 * 1000,
  })
}
