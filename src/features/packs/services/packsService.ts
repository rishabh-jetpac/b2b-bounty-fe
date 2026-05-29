import { apiClient } from '../../../lib/api/client'
import type { PackApiItem, PacksResponse } from '../apiTypes'
import type { Pack } from '../types'
import { normalizeRegionLabel } from '../utils/destinationFormatting'

export async function getPacks() {
  const response = await apiClient.get<PacksResponse>('/api/v1/packs')
  const rawPacks = Array.isArray(response.data.data) ? response.data.data : []

  return rawPacks
    .filter((pack) => pack.is_active === true)
    .map(normalizePack)
}

function normalizePack(pack: PackApiItem): Pack {
  const countryCode = pack.country_code.trim().toUpperCase()
  const displayName = normalizeRegionLabel(pack.region)

  return {
    id: pack.id,
    displayName: pack.name,
    name: pack.name,
    price: {
      currency: 'USD',
      value: pack.price_usd.toFixed(2),
      symbol: '$',
    },
    dataInGB: pack.data_gb,
    validityInDays: pack.validity_days,
    countryInfo:
      countryCode && displayName
        ? {
            code: countryCode,
            display_name: displayName,
          }
        : undefined,
  }
}
