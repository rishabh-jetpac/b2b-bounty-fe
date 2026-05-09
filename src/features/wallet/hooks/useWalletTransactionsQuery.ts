import { useQuery } from '@tanstack/react-query'
import { getWalletTransactions } from '../services/walletService'

export function useWalletTransactionsQuery() {
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: getWalletTransactions,
    retry: false,
    staleTime: 60 * 1000,
  })
}
