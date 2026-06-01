import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { getDestinationPacks } from '../services/destinationPacksService'

export function useDestinationPacksQuery(pageName: string) {
  const baseCurrency = useAuthStore((state) => state.user?.baseCurrency)

  return useQuery({
    queryKey: ['packs', 'destination', pageName, baseCurrency ?? ''],
    queryFn: () => getDestinationPacks(pageName, baseCurrency),
    enabled: pageName.trim().length > 0,
    retry: false,
    staleTime: 60 * 1000,
  })
}
