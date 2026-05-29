import { useQuery } from '@tanstack/react-query'
import { getDestinationPacks } from '../services/destinationPacksService'

export function useDestinationPacksQuery(pageName: string) {
  return useQuery({
    queryKey: ['packs', 'destination', pageName],
    queryFn: () => getDestinationPacks(pageName),
    enabled: pageName.trim().length > 0,
    retry: false,
    staleTime: 60 * 1000,
  })
}
