import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryQueryKey } from './useInventoryQuery'
import { reassignInventoryItem } from '../services/inventoryService'

export function useReassignInventoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      email,
      inventoryId,
    }: {
      email: string
      inventoryId: string
    }) => reassignInventoryItem(inventoryId, { email }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: inventoryQueryKey,
      })
    },
  })
}
