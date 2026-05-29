import { apiClient } from '../../../lib/api/client'
import type {
  RevampDestinationItemsResponse,
  RevampDestinationPackApiRecord,
} from '../apiTypes'
import type { Pack } from '../types'
import { normalizeRegionLabel } from '../utils/destinationFormatting'
import {
  extractFirstArray,
  getBoolean,
  getNumber,
  getString,
  isRecord,
} from './revampServiceUtils'

const REVAMP_ITEMS_ENDPOINT =
  'https://nlb-ap-southeast-1.jetpacstaging.com/v1/b2b/enterprise/catalog/revamp/items'

export async function getDestinationPacks(pageName: string) {
  const response = await apiClient.get<RevampDestinationItemsResponse>(REVAMP_ITEMS_ENDPOINT, {
    params: {
      pageName,
    },
  })

  const rawPacks = extractFirstArray(response.data)
  const normalizedPacks: Pack[] = []

  for (const rawPack of rawPacks) {
    if (!isRecord(rawPack)) {
      continue
    }

    const pack = normalizeDestinationPack(rawPack)

    if (!pack) {
      continue
    }

    normalizedPacks.push(pack)
  }

  return normalizedPacks
}

function normalizeDestinationPack(rawPack: RevampDestinationPackApiRecord) {
  const isActive = getBoolean(rawPack, ['is_active', 'isActive'])

  if (isActive === false) {
    return null
  }

  const id = getString(rawPack, ['id'])

  if (!id) {
    return null
  }

  const priceValue = getPackPriceValue(rawPack)

  if (priceValue === null) {
    return null
  }

  const dataInGB = getNumber(rawPack, ['data_gb', 'dataInGB', 'dataGb', 'data']) ?? 0
  const validityInDays =
    getNumber(rawPack, ['validity_days', 'validityInDays', 'validity']) ?? 0
  const name =
    getString(rawPack, ['name', 'pack_name', 'packName', 'title']) ?? 'Destination Pack'
  const countryCode =
    getString(rawPack, ['country_code', 'countryCode'])?.toUpperCase() ?? ''
  const countryDisplayName = getCountryDisplayName(rawPack)
  const currency =
    getString(rawPack, ['currency', 'currency_code', 'price_currency']) ?? 'USD'
  const symbol = getString(rawPack, ['currency_symbol', 'symbol']) ?? '$'

  return {
    id,
    name,
    price: {
      currency,
      value: priceValue.toFixed(2),
      symbol,
    },
    dataInGB,
    validityInDays,
    countryInfo:
      countryCode || countryDisplayName
        ? {
            code: countryCode,
            display_name: countryDisplayName,
          }
        : undefined,
  } satisfies Pack
}

function getCountryDisplayName(rawPack: RevampDestinationPackApiRecord) {
  const directDisplayName = getString(rawPack, [
    'display_name',
    'displayName',
    'country_name',
    'countryName',
    'region',
  ])

  return directDisplayName ? normalizeRegionLabel(directDisplayName) : ''
}

function getPackPriceValue(rawPack: RevampDestinationPackApiRecord) {
  const directPrice = getNumber(rawPack, ['price_usd', 'priceUsd', 'amount_usd', 'amountUsd'])

  if (directPrice !== null) {
    return directPrice
  }

  const priceRecord = rawPack.price

  if (!isRecord(priceRecord)) {
    return null
  }

  return getNumber(priceRecord, ['value', 'amount', 'price'])
}
