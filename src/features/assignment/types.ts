export type AssignmentPackSummary = {
  packId: string
  packName: string
  quantity: number
}

export type AssignmentRecipient = {
  email: string
  quantity: number
}

export type AssignmentSubmitPayload = {
  packId: string
  assignments: AssignmentRecipient[]
}

export type AssignmentFormValues = {
  assignments: AssignmentRecipient[]
}
