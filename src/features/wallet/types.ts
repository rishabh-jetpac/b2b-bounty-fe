export type Wallet = {
  balance: number
  balanceMinorUnits: number
  currency: string
  updatedAt: string
}

export type WalletTransactionType = 'debit' | 'credit'

export type WalletTransaction = {
  id: string
  type: WalletTransactionType
  amount: number
  amountMinorUnits: number
  currency: string
  title: string
  createdAt: string
}
