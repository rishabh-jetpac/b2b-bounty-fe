import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryQueryKey } from '../../inventory/hooks/useInventoryQuery'
import { submitAssignments } from '../services/assignmentService'

export function useSubmitAssignmentsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitAssignments,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: inventoryQueryKey,
      })
    },
  })
}
