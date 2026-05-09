import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchasePack } from '../services/purchaseService'

export function usePurchaseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: purchasePack,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['wallet'],
      })
    },
  })
}
