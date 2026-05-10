export type InventoryStatus = 'unassigned' | 'assigned' | 'failed'

export type InventoryItem = {
  id: string
  orgId: string
  packId: string
  packName: string
  status: InventoryStatus
  purchasedAt: string
  recipientEmail?: string
  eventAt?: string
}

export type InventoryTab = InventoryStatus

export type InventoryPackGroup = {
  packId: string
  packName: string
  quantity: number
  items: InventoryItem[]
}

export type InventoryCounts = {
  assigned: number
  failed: number
  unassigned: number
}

export type InventoryAssignmentSummary = {
  packId: string
  packName: string
  quantity: number
}

export type ReassignmentFormValues = {
  email: string
}
