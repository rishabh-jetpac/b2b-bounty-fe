import type { Pack } from '../types'

export function formatBalance(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPackPrice(pack: Pack) {
  return formatBalance(getPackPriceValue(pack), pack.price.currency)
}

export function getPackPriceValue(pack: Pack) {
  return Number(pack.price.value)
}

export function formatDataAmount(dataInGB: number) {
  return dataInGB === -1 ? 'Unlimited' : `${dataInGB}GB`
}

export function formatValidity(validityInDays: number) {
  return `${validityInDays} day${validityInDays === 1 ? '' : 's'}`
}
