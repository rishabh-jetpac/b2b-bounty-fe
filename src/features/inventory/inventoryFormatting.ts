import type { InventoryItem } from './types'

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
})

export function formatInventoryRecency(item: Pick<InventoryItem, 'eventAt' | 'purchasedAt'>) {
  const timestamp = getInventoryTimestamp(item)

  if (!timestamp) {
    return 'Date unavailable'
  }

  const diffMs = timestamp.getTime() - Date.now()
  const diffMinutes = Math.round(diffMs / (60 * 1000))
  const diffHours = Math.round(diffMs / (60 * 60 * 1000))
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000))

  if (Math.abs(diffMinutes) < 60) {
    return relativeTimeFormatter.format(diffMinutes, 'minute')
  }

  if (Math.abs(diffHours) < 24) {
    return relativeTimeFormatter.format(diffHours, 'hour')
  }

  if (Math.abs(diffDays) < 7) {
    return relativeTimeFormatter.format(diffDays, 'day')
  }

  return timestamp.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatInventoryDate(
  item: Pick<InventoryItem, 'eventAt' | 'purchasedAt'>,
) {
  const timestamp = getInventoryTimestamp(item)

  if (!timestamp) {
    return 'Date unavailable'
  }

  return timestamp.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getInventoryTimestamp(
  item: Pick<InventoryItem, 'eventAt' | 'purchasedAt'>,
) {
  return parseTimestamp(item.eventAt) ?? parseTimestamp(item.purchasedAt)
}

function parseTimestamp(value: string | undefined) {
  if (!value) {
    return null
  }

  const timestamp = new Date(value)

  if (Number.isNaN(timestamp.getTime())) {
    return null
  }

  return timestamp
}
