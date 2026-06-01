import { apiClient } from '../../../lib/api/client'
import type {
  InventoryApiItem,
  InventoryAssignRequest,
  InventoryResponse,
} from '../apiTypes'
import type { InventoryItem } from '../types'

export async function getInventory() {
  const response = await apiClient.get<InventoryResponse>('inventory')
  return response.data.data.map(mapInventoryItem)
}

export async function reassignInventoryItem(
  inventoryId: string,
  request: InventoryAssignRequest,
) {
  await apiClient.put(`inventory/${encodeURIComponent(inventoryId)}/assign`, request)
}

export async function assignInventoryItemToRecipient(
  packId: string,
  request: InventoryAssignRequest,
) {
  await apiClient.post(
    `inventory/packs/${encodeURIComponent(packId)}/assign`,
    request,
  )
}

function mapInventoryItem(item: InventoryApiItem): InventoryItem {
  return {
    id: item.id,
    orgId: item.org_id,
    packId: item.pack_id,
    packName: item.pack_name,
    status: item.status,
    purchasedAt: item.purchased_at,
    recipientEmail: normalizeOptionalString(item.recipientEmail),
    eventAt: normalizeOptionalString(item.assigned_at ?? item.failed_at),
  }
}

function normalizeOptionalString(value: string | null | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : undefined
}
