export type WalletApiItem = {
  balance_minor_units: number
  currency?: string
  updated_at: string
}

export type WalletResponse = {
  data: WalletApiItem
}

export type WalletTransactionApiItem = {
  id: string
  type: 'debit' | 'credit'
  amount_minor_units: number
  currency?: string
  created_at: string
}

export type WalletTransactionsResponse = {
  data: {
    transactions: WalletTransactionApiItem[]
  }
}
