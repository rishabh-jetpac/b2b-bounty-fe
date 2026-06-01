import type { Pack } from '../types'

export function formatBalance(amount: number, currency = 'USD') {
  const normalizedCurrency = currency.trim().toUpperCase() || 'USD'
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return `${normalizedCurrency} ${formattedAmount}`
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
