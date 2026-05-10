import { useQuery } from '@tanstack/react-query'
import { getInventory } from '../services/inventoryService'

export const inventoryQueryKey = ['inventory'] as const

export function useInventoryQuery() {
  return useQuery({
    queryKey: inventoryQueryKey,
    queryFn: getInventory,
    retry: false,
    staleTime: 60 * 1000,
  })
}
