export type Wallet = {
  id: string
  orgId: string
  balanceUsdCents: number
  balanceUsd: number
  updatedAt: string
}

export type WalletTransactionType = 'debit' | 'credit'

export type WalletTransaction = {
  id: string
  orgId: string
  type: WalletTransactionType
  amountUsdCents: number
  amountUsd: number
  reason: string | Record<string, number>
  title: string
  createdAt: string
}
