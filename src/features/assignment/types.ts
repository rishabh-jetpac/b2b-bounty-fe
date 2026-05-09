export type OrderResponse = {
  order_id: string
  pack: {
    catalog_id: string
    displayName: string
  }
  quantity: number
  timestamp: string
}

export type AssignmentRecipient = {
  email: string
  quantity: number
}

export type AssignmentSubmitPayload = {
  order_id: string
  assignments: AssignmentRecipient[]
}

export type AssignmentFormValues = {
  assignments: AssignmentRecipient[]
}
