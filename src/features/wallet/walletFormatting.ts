import type { WalletTransactionType } from './types'

const walletDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})

export function formatWalletCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatWalletAmount(
  amount: number,
  type: WalletTransactionType,
  currency = 'USD',
) {
  const symbol = type === 'credit' ? '+' : '-'
  return `${symbol}${formatWalletCurrency(amount, currency)}`
}

export function formatWalletDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)

  return walletDateFormatter.format(new Date(year, month - 1, day))
}
