const walletUpdatedAtFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const walletTransactionDateFormatter = new Intl.DateTimeFormat('en-US', {
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

export function formatWalletUpdatedAt(value: string) {
  return walletUpdatedAtFormatter.format(new Date(value))
}

export function formatWalletTransactionAmount(
  amount: number,
  type: 'debit' | 'credit',
  currency = 'USD',
) {
  const sign = type === 'credit' ? '+' : '-'

  return `${sign}${formatWalletCurrency(amount, currency)}`
}

export function formatWalletTransactionDate(value: string) {
  return walletTransactionDateFormatter.format(new Date(value))
}

export function formatWalletTransactionId(value: string) {
  return value.slice(0, 8).toUpperCase()
}
