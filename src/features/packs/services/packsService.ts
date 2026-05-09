import { apiClient } from '../../../lib/api/client'
import type { PackApiItem, PacksResponse } from '../apiTypes'
import type { Pack } from '../types'

const uppercaseRegionLabels = new Map([
  ['eu', 'EU'],
  ['uae', 'UAE'],
  ['uk', 'UK'],
  ['usa', 'USA'],
  ['us', 'US'],
])

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

function normalizeRegionLabel(region: string) {
  const sanitizedRegion = region.trim().replace(/[_-]+/g, ' ')

  if (!sanitizedRegion) {
    return ''
  }

  return sanitizedRegion
    .split(/\s+/)
    .map((segment) => {
      const uppercaseMatch = uppercaseRegionLabels.get(segment.toLowerCase())

      if (uppercaseMatch) {
        return uppercaseMatch
      }

      return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
    })
    .join(' ')
}
