import { apiClient } from '../../../lib/api/client'
import type {
  WalletApiItem,
  WalletResponse,
  WalletTransactionApiItem,
  WalletTransactionsResponse,
} from '../apiTypes'
import type { Wallet, WalletTransaction, WalletTransactionType } from '../types'

const DEFAULT_WALLET_CURRENCY = 'USD'

export async function getWallet(fallbackCurrency?: string) {
  const response = await apiClient.get<WalletResponse>('auth/wallet/balance')

  return normalizeWallet(response.data.data, fallbackCurrency)
}

export async function getWalletTransactions(fallbackCurrency?: string) {
  const response = await apiClient.get<WalletTransactionsResponse>(
    'auth/wallet/transactions',
  )

  return response.data.data.transactions.map((transaction) =>
    normalizeWalletTransaction(transaction, fallbackCurrency),
  )
}

function normalizeWallet(wallet: WalletApiItem, fallbackCurrency?: string): Wallet {
  const balanceMinorUnits = Number.isFinite(wallet.balance_minor_units)
    ? wallet.balance_minor_units
    : 0

  return {
    balance: balanceMinorUnits / 100,
    balanceMinorUnits,
    currency: normalizeCurrency(wallet.currency, fallbackCurrency),
    updatedAt: wallet.updated_at,
  }
}

function normalizeWalletTransaction(
  transaction: WalletTransactionApiItem,
  fallbackCurrency?: string,
): WalletTransaction {
  const amountMinorUnits = Number.isFinite(transaction.amount_minor_units)
    ? Math.abs(transaction.amount_minor_units)
    : 0

  return {
    id: transaction.id,
    type: transaction.type,
    amount: amountMinorUnits / 100,
    amountMinorUnits,
    currency: normalizeCurrency(transaction.currency, fallbackCurrency),
    title: getWalletTransactionTitle(transaction.type),
    createdAt: transaction.created_at,
  }
}

function getWalletTransactionTitle(type: WalletTransactionType): string {
  return type === 'credit' ? 'Wallet credit' : 'Wallet debit'
}

function normalizeCurrency(currency?: string, fallbackCurrency?: string) {
  const normalizedCurrency = currency?.trim().toUpperCase()
  const normalizedFallbackCurrency = fallbackCurrency?.trim().toUpperCase()

  return normalizedCurrency || normalizedFallbackCurrency || DEFAULT_WALLET_CURRENCY
}
