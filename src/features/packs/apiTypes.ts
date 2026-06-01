export type RevampDestinationApiItem = {
  displayName: string
  pageId: string
  pageName: string
}

export type RevampDestinationDirectoryResponse = {
  data: {
    allPacks: RevampDestinationApiItem[]
    limit: number
    page: number
    total: number
    totalPages: number
  }
  status: string
}

export type RevampPackPriceApiItem = {
  currency?: string
  listPrice?: number
  price?: number
}

export type RevampDestinationPackApiItem = {
  id?: string
  displayName?: string
  name?: string
  title?: string
  dataInGB?: number
  validityInDays?: number
  price?: RevampPackPriceApiItem
  isActive?: boolean
}

export type RevampDestinationItemsResponse = {
  data?: {
    catalogItem?: RevampDestinationPackApiItem[]
  }
  status?: string
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
