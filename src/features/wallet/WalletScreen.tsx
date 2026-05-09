import { Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { useAuthenticatedHeader } from '../../app/useAuthenticatedHeader'
import { colors } from '../../colors'
import { getApiErrorMessage } from '../../lib/api/errors'
import { useWalletQuery } from './hooks/useWalletQuery'
import { useWalletTransactionsQuery } from './hooks/useWalletTransactionsQuery'
import type { WalletTransaction } from './types'
import {
  formatWalletCurrency,
  formatWalletTransactionAmount,
  formatWalletTransactionDate,
  formatWalletTransactionId,
  formatWalletUpdatedAt,
} from './walletFormatting'

export function WalletScreen() {
  const walletQuery = useWalletQuery()
  const walletTransactionsQuery = useWalletTransactionsQuery()

  useAuthenticatedHeader({
    title: 'Wallet',
  })

  const walletErrorMessage = walletQuery.isError
    ? getApiErrorMessage(
        walletQuery.error,
        'We could not load your wallet balance. Please try again.',
      )
    : ''

  if (walletQuery.isPending) {
    return <LoadingState />
  }

  if (walletQuery.isError || !walletQuery.data) {
    return (
      <StateCard
        action={
          <Button
            onClick={() => {
              void walletQuery.refetch()
            }}
            sx={stateActionButtonSx}
            variant="contained"
          >
            Retry
          </Button>
        }
        description={walletErrorMessage}
        title="We could not load your wallet"
      />
    )
  }

  const wallet = walletQuery.data
  const walletTransactions = walletTransactionsQuery.data ?? []

  return (
    <Stack spacing={2.25}>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 108, sm: 118 },
          borderRadius: '8px',
          px: 2.5,
          py: 2,
          background: `linear-gradient(135deg, ${colors.primaryContainer} 0%, ${colors.primary} 100%)`,
          color: colors.onPrimary,
          boxShadow: `0 16px 32px ${alpha(colors.primary, 0.2)}`,
        }}
      >
        <Stack
          spacing={0.9}
          sx={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: alpha(colors.onPrimary, 0.84),
            }}
          >
            Total Balance
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: colors.onPrimary,
              fontSize: { xs: '1.95rem', sm: '2.15rem' },
              lineHeight: 1.15,
            }}
          >
            {formatWalletCurrency(wallet.balanceUsd)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: alpha(colors.onPrimary, 0.84),
            }}
          >
            {`Last updated ${formatWalletUpdatedAt(wallet.updatedAt)}`}
          </Typography>
        </Stack>
      </Paper>

      <Stack spacing={1.25}>
        <Typography
          variant="h3"
          sx={{
            color: colors.onSurface,
            fontSize: { xs: '1rem', sm: '1.05rem' },
          }}
        >
          Transaction History
        </Typography>

        {walletTransactionsQuery.isPending ? (
          <LoadingHistoryState />
        ) : walletTransactionsQuery.isError ? (
          <StateCard
            action={
              <Button
                onClick={() => {
                  void walletTransactionsQuery.refetch()
                }}
                sx={stateActionButtonSx}
                variant="contained"
              >
                Retry
              </Button>
            }
            description={getApiErrorMessage(
              walletTransactionsQuery.error,
              'We could not load your transaction history. Please try again.',
            )}
            title="We could not load your history"
          />
        ) : walletTransactions.length === 0 ? (
          <StateCard
            description="Transactions will appear here once this wallet has activity."
            title="No transaction history yet"
          />
        ) : (
          <Stack spacing={1.25}>
            {walletTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

function LoadingState() {
  return (
    <Paper elevation={0} sx={stateCardSx}>
      <Stack
        spacing={1.5}
        sx={{
          minHeight: 220,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <CircularProgress size={28} />
        <Typography variant="h3" sx={{ color: colors.onSurface }}>
          Loading wallet
        </Typography>
        <Typography sx={{ color: colors.onSurfaceVariant }}>
          Fetching the latest wallet balance for this account.
        </Typography>
      </Stack>
    </Paper>
  )
}

function LoadingHistoryState() {
  return (
    <Paper elevation={0} sx={stateCardSx}>
      <Stack spacing={1.25} sx={{ alignItems: 'center', py: 1.5, textAlign: 'center' }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ color: colors.onSurfaceVariant }}>
          Fetching the latest wallet transactions.
        </Typography>
      </Stack>
    </Paper>
  )
}

type TransactionCardProps = {
  transaction: WalletTransaction
}

function TransactionCard({ transaction }: TransactionCardProps) {
  const amountColor =
    transaction.type === 'credit' ? colors.primaryContainer : colors.error

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '8px',
        border: `1px solid ${colors.outlineVariant}`,
        px: 2,
        py: 1.75,
        backgroundColor: colors.surfaceContainerLowest,
      }}
    >
      <Stack spacing={0.9}>
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'space-between' }}>
          <Typography
            sx={{
              flex: 1,
              minWidth: 0,
              color: colors.onSurface,
              fontSize: '0.98rem',
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            {transaction.title}
          </Typography>
          <Typography
            sx={{
              flexShrink: 0,
              color: amountColor,
              fontSize: '0.98rem',
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            {formatWalletTransactionAmount(transaction.amountUsd, transaction.type)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            color: colors.onSurfaceVariant,
            fontSize: '0.8125rem',
            lineHeight: 1.4,
          }}
        >
          <Typography
            sx={{
              minWidth: 0,
              color: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {`Txn ID: ${formatWalletTransactionId(transaction.id)}`}
          </Typography>
          <Typography
            sx={{
              flexShrink: 0,
              color: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {formatWalletTransactionDate(transaction.createdAt)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}

type StateCardProps = {
  action?: ReactNode
  description: string
  title: string
}

function StateCard({ action, description, title }: StateCardProps) {
  return (
    <Paper elevation={0} sx={stateCardSx}>
      <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <Typography variant="h3" sx={{ color: colors.onSurface }}>
          {title}
        </Typography>
        <Typography sx={{ color: colors.onSurfaceVariant }}>{description}</Typography>
        {action ?? null}
      </Stack>
    </Paper>
  )
}

const stateCardSx = {
  borderRadius: '8px',
  border: `1px solid ${colors.outlineVariant}`,
  px: 2.5,
  py: 3,
} as const

const stateActionButtonSx = {
  backgroundColor: colors.primaryContainer,
  '&:hover': {
    backgroundColor: colors.primary,
  },
} as const
