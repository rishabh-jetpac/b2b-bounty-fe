export type CountryInfo = {
  display_name: string
  code: string
}

export type Pack = {
  id: string
  name: string
  price: {
    currency: string
    value: string
    symbol: string
  }
  dataInGB: number
  validityInDays: number
  countryInfo?: CountryInfo
}

export type PurchasedInventoryItem = {
  id: string
  orgId: string
  packId: string
  packName: string
  status: 'unassigned' | 'assigned' | 'failed'
  purchasedAt: string
}

export type PurchaseResult = {
  quantity: number
  packName: string
  items: PurchasedInventoryItem[]
}

export type PacksFilters = {
  country?: string
  validityInDays?: number
  dataInGB?: number
}

export type FilterSheetKey = 'country' | 'validityInDays' | 'dataInGB'
