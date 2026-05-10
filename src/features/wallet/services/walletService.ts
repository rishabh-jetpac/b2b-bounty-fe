import { apiClient } from '../../../lib/api/client'
import type {
  WalletApiItem,
  WalletResponse,
  WalletTopUpResponse,
  WalletTransactionApiItem,
  WalletTransactionsResponse,
} from '../apiTypes'
import type {
  Wallet,
  WalletTopUpRequest,
  WalletTransaction,
  WalletTransactionType,
} from '../types'

export async function getWallet() {
  const response = await apiClient.get<WalletResponse>('/api/v1/wallet')

  return normalizeWallet(response.data.data)
}

export async function getWalletTransactions() {
  const response = await apiClient.get<WalletTransactionsResponse>(
    '/api/v1/wallet/transactions',
  )

  return response.data.data.map(normalizeWalletTransaction)
}

export async function topUpWallet(request: WalletTopUpRequest) {
  const response = await apiClient.post<WalletTopUpResponse>('/api/v1/wallet/topup', {
    amount_usd: request.amountUsd,
  })

  return {
    message: response.data.data.message,
  }
}

function normalizeWallet(wallet: WalletApiItem): Wallet {
  const balanceUsdCents = Number.isFinite(wallet.balance_usd_cents)
    ? wallet.balance_usd_cents
    : Math.round(wallet.balance_usd * 100)

  return {
    id: wallet.id,
    orgId: wallet.org_id,
    balanceUsdCents,
    balanceUsd: balanceUsdCents / 100,
    updatedAt: wallet.updated_at,
  }
}

function normalizeWalletTransaction(
  transaction: WalletTransactionApiItem,
): WalletTransaction {
  const amountUsdCents = Number.isFinite(transaction.amount_cents)
    ? Math.abs(transaction.amount_cents)
    : 0

  return {
    id: transaction.id,
    orgId: transaction.org_id,
    type: transaction.type,
    amountUsdCents,
    amountUsd: amountUsdCents / 100,
    reason: transaction.reason,
    title: getWalletTransactionTitle(transaction.reason, transaction.type),
    createdAt: transaction.created_at,
  }
}

function getWalletTransactionTitle(
  reason: string | Record<string, number>,
  type: WalletTransactionType,
): string {
  if (typeof reason !== 'string') {
    if ('topup' in reason) {
      return 'Wallet top-up'
    }

    const purchases = Object.entries(reason)
      .filter(([packName, quantity]) => packName.trim() && quantity > 0)
      .map(([packName, quantity]) =>
        quantity > 1 ? `${packName} x${quantity}` : packName,
      )

    if (purchases.length > 0) {
      return purchases.join(', ')
    }
  }

  if (typeof reason !== 'string') {
    return type === 'credit' ? 'Wallet credit' : 'Wallet debit'
  }

  const [prefix, details = ''] = reason.split(':', 2)

  if (prefix === 'purchase') {
    const purchaseIds = details.split(',').filter(Boolean)

    return purchaseIds.length > 1
      ? `Pack purchase x${purchaseIds.length}`
      : 'Pack purchase'
  }

  if (prefix === 'topup') {
    return 'Wallet top-up'
  }

  if (prefix.trim()) {
    return prefix
      .split(/[_-\s]+/)
      .filter(Boolean)
      .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
      .join(' ')
  }

  return type === 'credit' ? 'Wallet credit' : 'Wallet debit'
}
