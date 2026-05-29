import { useQuery } from '@tanstack/react-query'
import { getDestinations } from '../services/destinationDirectoryService'

export const destinationDirectoryQueryKey = ['packs', 'destinations'] as const

export function useDestinationDirectoryQuery() {
  return useQuery({
    queryKey: destinationDirectoryQueryKey,
    queryFn: getDestinations,
    gcTime: 10 * 60 * 1000,
    retry: false,
    staleTime: 10 * 60 * 1000,
  })
}
