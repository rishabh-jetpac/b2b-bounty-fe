export type PackApiItem = {
  id: string
  name: string
  country_code: string
  region: string
  data_gb: number
  validity_days: number
  price_usd_cents: number
  price_usd: number
  is_active: boolean
}

export type PacksResponse = {
  data: PackApiItem[]
}

export type PurchaseRequest = {
  pack_id: string
  quantity: number
}

export type PurchaseInventoryApiItem = {
  id: string
  org_id: string
  pack_id: string
  pack_name: string
  status: 'unassigned' | 'assigned' | 'failed'
  purchased_at: string
}

export type PurchaseResponse = {
  data: {
    quantity: number
    items: PurchaseInventoryApiItem[]
  }
}
