import { apiClient } from '../../../lib/api/client'
import { BASE_URL } from '../../../../contants'
import type { RevampDestinationItemsResponse, RevampDestinationPackApiItem } from '../apiTypes'
import type { Pack } from '../types'

const REVAMP_ITEMS_ENDPOINT = `${BASE_URL}/catalog/revamp/items`

export async function getDestinationPacks(pageName: string, currency?: string) {
  const response = await apiClient.get<RevampDestinationItemsResponse>(REVAMP_ITEMS_ENDPOINT, {
    params: {
      ...(currency ? { currency } : {}),
      pageName,
    },
  })

  const rawPacks = Array.isArray(response.data.data?.catalogItem)
    ? response.data.data.catalogItem
    : []

  return rawPacks.flatMap((rawPack) => {
    const pack = normalizeDestinationPack(rawPack)

    return pack ? [pack] : []
  })
}

function normalizeDestinationPack(rawPack: RevampDestinationPackApiItem) {
  if (!rawPack.id || !rawPack.price || typeof rawPack.price.price !== 'number') {
    return null
  }

  const displayName = normalizeText(rawPack.displayName)
  const name = normalizeText(rawPack.name) ?? normalizeText(rawPack.title) ?? displayName
  const normalizedCurrency = normalizeCurrency(rawPack.price.currency)

  return {
    id: rawPack.id,
    displayName,
    name,
    price: {
      currency: normalizedCurrency,
      value: rawPack.price.price.toFixed(2),
    },
    dataInGB: rawPack.dataInGB ?? 0,
    validityInDays: rawPack.validityInDays ?? 0,
  } satisfies Pack
}

function normalizeCurrency(currency?: string) {
  const normalizedCurrency = currency?.trim().toUpperCase()

  return normalizedCurrency || 'USD'
}

function normalizeText(value?: string) {
  const normalizedValue = value?.trim()

  return normalizedValue || undefined
}
