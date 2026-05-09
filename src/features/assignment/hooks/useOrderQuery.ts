import { useQuery } from '@tanstack/react-query'
import { getOrderById } from '../services/mockOrderService'

export function useOrderQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => {
      if (!orderId) {
        throw new Error('Order id is required.')
      }

      return getOrderById(orderId)
    },
    enabled: Boolean(orderId),
    retry: false,
  })
}
