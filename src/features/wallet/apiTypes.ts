export type WalletApiItem = {
  id: string
  org_id: string
  balance_usd_cents: number
  balance_usd: number
  updated_at: string
}

export type WalletResponse = {
  data: WalletApiItem
}

export type WalletTransactionApiItem = {
  id: string
  org_id: string
  type: 'debit' | 'credit'
  amount_cents: number
  reason: string | Record<string, number>
  created_at: string
}

export type WalletTransactionsResponse = {
  data: WalletTransactionApiItem[]
}

export type WalletTopUpApiItem = {
  message: string
}

export type WalletTopUpResponse = {
  data: WalletTopUpApiItem
}
