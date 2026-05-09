import { useMutation } from '@tanstack/react-query'
import { submitAssignments } from '../services/assignmentService'

export function useSubmitAssignmentsMutation() {
  return useMutation({
    mutationFn: submitAssignments,
  })
}
