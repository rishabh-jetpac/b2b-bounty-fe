export type CountryInfo = {
  display_name: string
  code: string
}

export type Destination = {
  displayName: string
  pageName: string
}

export type Pack = {
  id: string
  displayName?: string
  name?: string
  price: {
    currency: string
    value: string
  }
  dataInGB: number
  validityInDays: number
  countryInfo?: CountryInfo
}

export type DestinationPackSection =
  | {
      kind: 'unlimited'
      title: 'Unlimited'
      packs: Pack[]
    }
  | {
      kind: 'days'
      packs: Pack[]
      title: string
      validityInDays: number
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

export type PacksRouteState = {
  purchaseSuccessMessage?: string
}
