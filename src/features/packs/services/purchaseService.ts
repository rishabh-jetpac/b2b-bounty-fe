import { apiClient } from '../../../lib/api/client'
import type { PurchaseRequest, PurchaseResponse } from '../apiTypes'
import type { PurchaseResult } from '../types'

export async function purchasePack(request: PurchaseRequest): Promise<PurchaseResult> {
  const response = await apiClient.post<PurchaseResponse>(
    '/api/v1/inventory/purchase',
    request,
  )

  return {
    quantity: response.data.data.quantity,
    packName: response.data.data.items[0]?.pack_name ?? '',
    items: response.data.data.items.map((item) => ({
      id: item.id,
      orgId: item.org_id,
      packId: item.pack_id,
      packName: item.pack_name,
      status: item.status,
      purchasedAt: item.purchased_at,
    })),
  }
}
