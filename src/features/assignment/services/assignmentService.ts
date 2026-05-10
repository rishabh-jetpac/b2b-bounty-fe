import { assignInventoryItemToRecipient } from '../../inventory/services/inventoryService'
import type { AssignmentSubmitPayload } from '../types'

export async function submitAssignments(payload: AssignmentSubmitPayload) {
  const requests = payload.assignments.flatMap((assignment) =>
    Array.from({ length: assignment.quantity }, () =>
      assignInventoryItemToRecipient(payload.packId, {
        email: assignment.email,
      }),
    ),
  )

  await Promise.all(requests)

  return {
    packId: payload.packId,
    submittedCount: requests.length,
    success: true as const,
  }
}
