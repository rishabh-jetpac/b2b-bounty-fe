import { useQuery } from '@tanstack/react-query'
import { getPacks } from '../services/packsService'

export function usePacksQuery() {
  return useQuery({
    queryKey: ['packs'],
    queryFn: getPacks,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
