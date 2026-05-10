export type InventoryApiItem = {
  id?: string
  org_id?: string
  orgId?: string
  pack_id?: string
  packId?: string
  pack_name?: string
  packName?: string
  status?: string
  purchased_at?: string
  purchasedAt?: string
  recipient_email?: string | null
  recipientEmail?: string | null
  event_at?: string | null
  eventAt?: string | null
  assigned_at?: string | null
  assignedAt?: string | null
  failed_at?: string | null
  failedAt?: string | null
  updated_at?: string | null
  updatedAt?: string | null
}

export type InventoryResponse =
  | InventoryApiItem[]
  | {
      data?: InventoryApiItem[] | null
    }
  | {
      data?: {
        data?: InventoryApiItem[] | null
        inventory?: InventoryApiItem[] | null
        items?: InventoryApiItem[] | null
      } | null
    }

export type InventoryAssignRequest = {
  email: string
}
