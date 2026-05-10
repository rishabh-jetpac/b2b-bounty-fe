export type InventoryApiItem = {
  id: string
  org_id: string
  pack_id: string
  pack_name: string
  status: 'unassigned' | 'assigned' | 'failed'
  purchased_at: string
  recipientEmail?: string | null
  assigned_at?: string | null
  user_id?: string | null
  assigned_by?: string | null
  failed_at?: string | null
}

export type InventoryResponse = {
  data: InventoryApiItem[]
}

export type InventoryAssignRequest = {
  email: string
}
