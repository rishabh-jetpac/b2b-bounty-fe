export type WalletTransactionType = 'debit' | 'credit'

export type WalletTransaction = {
  id: string
  title: string
  transactionId: string
  date: string
  amount: number
  type: WalletTransactionType
}
