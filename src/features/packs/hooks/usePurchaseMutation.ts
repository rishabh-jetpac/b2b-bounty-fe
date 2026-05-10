import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryQueryKey } from '../../inventory/hooks/useInventoryQuery'
import { purchasePack } from '../services/purchaseService'

export function usePurchaseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: purchasePack,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['wallet'],
        }),
        queryClient.invalidateQueries({
          queryKey: inventoryQueryKey,
        }),
      ])
    },
  })
}
