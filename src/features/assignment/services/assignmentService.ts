import type { AssignmentSubmitPayload } from '../types'

const serviceDelayMs = 350

function wait(delayMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs)
  })
}

export async function submitAssignments(payload: AssignmentSubmitPayload) {
  await wait(serviceDelayMs)

  return {
    order_id: payload.order_id,
    success: true as const,
  }
}
