import { useQuery } from '@tanstack/react-query'
import { getDestinations } from '../services/destinationDirectoryService'

export const destinationDirectoryQueryKey = ['packs', 'destinations'] as const

export function useDestinationDirectoryQuery() {
  return useQuery({
    queryKey: destinationDirectoryQueryKey,
    queryFn: getDestinations,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
