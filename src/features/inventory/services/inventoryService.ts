import { apiClient } from '../../../lib/api/client'
import type {
  InventoryApiItem,
  InventoryAssignRequest,
  InventoryResponse,
} from '../apiTypes'
import type { InventoryItem, InventoryStatus } from '../types'

export async function getInventory() {
  const response = await apiClient.get<InventoryResponse>('/api/v1/inventory')
  const rawItems = extractInventoryItems(response.data)

  return rawItems.map(normalizeInventoryItem).filter(isInventoryItem)
}

export async function reassignInventoryItem(
  inventoryId: string,
  request: InventoryAssignRequest,
) {
  await apiClient.put(`/api/v1/inventory/${encodeURIComponent(inventoryId)}/assign`, request)
}

export async function assignInventoryItemToRecipient(
  packId: string,
  request: InventoryAssignRequest,
) {
  await apiClient.post(
    `/api/v1/inventory/packs/${encodeURIComponent(packId)}/assign`,
    request,
  )
}

function extractInventoryItems(responseData: InventoryResponse | undefined) {
  if (!responseData) {
    return []
  }

  if (Array.isArray(responseData)) {
    return responseData
  }

  if (Array.isArray(responseData.data)) {
    return responseData.data
  }

  if (responseData.data && typeof responseData.data === 'object') {
    if (Array.isArray(responseData.data.data)) {
      return responseData.data.data
    }

    if (Array.isArray(responseData.data.inventory)) {
      return responseData.data.inventory
    }

    if (Array.isArray(responseData.data.items)) {
      return responseData.data.items
    }
  }

  return []
}

function normalizeInventoryItem(item: InventoryApiItem): InventoryItem | null {
  const id = item.id?.trim()
  const packId = (item.pack_id ?? item.packId ?? '').trim()
  const packName = (item.pack_name ?? item.packName ?? '').trim()
  const purchasedAt = (item.purchased_at ?? item.purchasedAt ?? '').trim()
  const status = normalizeInventoryStatus(item.status)

  if (!id || !packId || !packName || !purchasedAt || !status) {
    return null
  }

  return {
    id,
    orgId: (item.org_id ?? item.orgId ?? '').trim(),
    packId,
    packName,
    status,
    purchasedAt,
    recipientEmail: normalizeOptionalString(item.recipient_email ?? item.recipientEmail),
    eventAt: normalizeEventAt(item, status),
  }
}

function normalizeInventoryStatus(status: string | undefined): InventoryStatus | null {
  const normalizedStatus = status?.trim().toLowerCase()

  if (
    normalizedStatus === 'unassigned' ||
    normalizedStatus === 'assigned' ||
    normalizedStatus === 'failed'
  ) {
    return normalizedStatus
  }

  return null
}

function normalizeEventAt(item: InventoryApiItem, status: InventoryStatus) {
  const eventCandidates =
    status === 'assigned'
      ? [
          item.assigned_at,
          item.assignedAt,
          item.event_at,
          item.eventAt,
          item.updated_at,
          item.updatedAt,
          item.purchased_at,
          item.purchasedAt,
        ]
      : status === 'failed'
        ? [
            item.failed_at,
            item.failedAt,
            item.event_at,
            item.eventAt,
            item.updated_at,
            item.updatedAt,
            item.purchased_at,
            item.purchasedAt,
          ]
        : [
            item.event_at,
            item.eventAt,
            item.updated_at,
            item.updatedAt,
            item.purchased_at,
            item.purchasedAt,
          ]

  for (const candidate of eventCandidates) {
    const normalizedCandidate = normalizeOptionalString(candidate)

    if (normalizedCandidate) {
      return normalizedCandidate
    }
  }

  return undefined
}

function normalizeOptionalString(value: string | null | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : undefined
}

function isInventoryItem(item: InventoryItem | null): item is InventoryItem {
  return item !== null
}
