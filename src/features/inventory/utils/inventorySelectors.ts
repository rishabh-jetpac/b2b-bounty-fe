import { getInventoryTimestamp } from './inventoryFormatting'
import type {
  InventoryAssignmentSummary,
  InventoryCounts,
  InventoryItem,
  InventoryPackGroup,
} from '../types'

export function getInventoryCounts(items: InventoryItem[]): InventoryCounts {
  const groupedUnassigned = groupInventoryByPack(
    items.filter((item) => item.status === 'unassigned'),
  )

  return {
    unassigned: groupedUnassigned.length,
    assigned: items.filter((item) => item.status === 'assigned').length,
    failed: items.filter((item) => item.status === 'failed').length,
  }
}

export function getGroupedUnassignedInventory(items: InventoryItem[]) {
  return groupInventoryByPack(items.filter((item) => item.status === 'unassigned'))
}

export function getAssignedInventory(items: InventoryItem[]) {
  return sortInventoryByRecency(
    items.filter((item) => item.status === 'assigned'),
  )
}

export function getFailedInventory(items: InventoryItem[]) {
  return sortInventoryByRecency(items.filter((item) => item.status === 'failed'))
}

export function filterInventoryPackGroups(groups: InventoryPackGroup[], query: string) {
  const normalizedQuery = normalizeInventoryQuery(query)

  if (!normalizedQuery) {
    return groups
  }

  return groups.filter((group) =>
    [group.packName, group.packId].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    ),
  )
}

export function filterInventoryItems(items: InventoryItem[], query: string) {
  const normalizedQuery = normalizeInventoryQuery(query)

  if (!normalizedQuery) {
    return items
  }

  return items.filter((item) =>
    [item.packName, item.packId, item.recipientEmail ?? ''].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    ),
  )
}

export function getInventoryPackAssignmentSummary(
  items: InventoryItem[],
  packId: string,
): InventoryAssignmentSummary | undefined {
  const matchingItems = items.filter(
    (item) => item.status === 'unassigned' && item.packId === packId,
  )

  if (matchingItems.length === 0) {
    return undefined
  }

  return {
    packId,
    packName: matchingItems[0]?.packName ?? 'Inventory Pack',
    quantity: matchingItems.length,
  }
}

function groupInventoryByPack(items: InventoryItem[]) {
  const groups = new Map<string, InventoryPackGroup>()

  for (const item of items) {
    const groupKey = `${item.packId}:${item.packName}`
    const existingGroup = groups.get(groupKey)

    if (existingGroup) {
      existingGroup.quantity += 1
      existingGroup.items.push(item)
      continue
    }

    groups.set(groupKey, {
      packId: item.packId,
      packName: item.packName,
      quantity: 1,
      items: [item],
    })
  }

  return Array.from(groups.values())
}

function sortInventoryByRecency(items: InventoryItem[]) {
  return [...items].sort((left, right) => {
    const leftTimestamp = getInventoryTimestamp(left)?.getTime() ?? 0
    const rightTimestamp = getInventoryTimestamp(right)?.getTime() ?? 0

    return rightTimestamp - leftTimestamp
  })
}

function normalizeInventoryQuery(query: string) {
  return query.trim().toLowerCase()
}
