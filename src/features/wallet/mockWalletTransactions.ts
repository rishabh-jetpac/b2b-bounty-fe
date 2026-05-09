import type { WalletTransaction } from './types'

export const mockWalletBalance = 1250

const rawWalletTransactions: WalletTransaction[] = [
  {
    id: 'txn-10518',
    title: 'Japan pack purchase',
    transactionId: 'TXN-10518',
    date: '2026-05-09',
    amount: 42,
    type: 'debit',
  },
  {
    id: 'txn-10512',
    title: 'Promotional credit',
    transactionId: 'TXN-10512',
    date: '2026-05-08',
    amount: 25,
    type: 'credit',
  },
  {
    id: 'txn-10503',
    title: 'Singapore weekly pack',
    transactionId: 'TXN-10503',
    date: '2026-05-06',
    amount: 24,
    type: 'debit',
  },
  {
    id: 'txn-10498',
    title: 'Refund adjustment',
    transactionId: 'TXN-10498',
    date: '2026-05-05',
    amount: 12.5,
    type: 'credit',
  },
  {
    id: 'txn-10484',
    title: 'Malaysia explorer pack',
    transactionId: 'TXN-10484',
    date: '2026-05-03',
    amount: 15,
    type: 'debit',
  },
  {
    id: 'txn-10471',
    title: 'Partner rebate',
    transactionId: 'TXN-10471',
    date: '2026-05-01',
    amount: 18,
    type: 'credit',
  },
]

export const mockWalletTransactions = [...rawWalletTransactions].sort((left, right) =>
  right.date.localeCompare(left.date),
)
