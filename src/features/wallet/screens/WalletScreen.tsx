import {
  Button,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useState, type ReactNode } from 'react'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { PullToRefreshContainer } from '../../../components/PullToRefreshContainer'
import { colors } from '../../../colors'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { useWalletQuery } from '../hooks/useWalletQuery'
import { useWalletTransactionsQuery } from '../hooks/useWalletTransactionsQuery'
import type { WalletTransaction, WalletTransactionType } from '../types'
import {
  formatWalletCurrency,
  formatWalletTransactionAmount,
  formatWalletTransactionDate,
  formatWalletTransactionId,
  formatWalletUpdatedAt,
} from '../utils/walletFormatting'

export function WalletScreen() {
  const walletQuery = useWalletQuery()
  const walletTransactionsQuery = useWalletTransactionsQuery()
  const [transactionFilter, setTransactionFilter] =
    useState<TransactionHistoryFilter>('all')

  useAuthenticatedHeader({
    title: 'Wallet',
  })

  const walletErrorMessage = walletQuery.isError
    ? getApiErrorMessage(
        walletQuery.error,
        'We could not load your wallet balance. Please try again.',
      )
    : ''

  async function handleRefresh() {
    await Promise.all([walletQuery.refetch(), walletTransactionsQuery.refetch()])
  }

  if (walletQuery.isPending) {
    return <LoadingState />
  }

  if (walletQuery.isError || !walletQuery.data) {
    return (
      <PullToRefreshContainer
        backgroundColor={colors.surfaceContainerLowest}
        onRefresh={handleRefresh}
      >
        <StateCard
          action={
            <Button
              onClick={() => {
                void handleRefresh()
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
      </PullToRefreshContainer>
    )
  }

  const wallet = walletQuery.data
  const walletTransactions = walletTransactionsQuery.data ?? []
  const filteredWalletTransactions =
    transactionFilter === 'all'
      ? walletTransactions
      : walletTransactions.filter(
          (transaction) => transaction.type === transactionFilter,
        )

  return (
    <>
      <PullToRefreshContainer
        backgroundColor={colors.surfaceContainerLowest}
        onRefresh={handleRefresh}
      >
        <Stack spacing={2.25}>
          <Paper
            elevation={0}
            sx={{
              overflow: 'hidden',
              minHeight: { xs: 108, sm: 118 },
              borderRadius: 1.5,
              px: 2.5,
              py: 2,
              background: `linear-gradient(135deg, ${colors.primaryContainer} 0%, ${colors.primary} 100%)`,
              color: colors.onPrimary,
            }}
          >
            <Stack spacing={0.9}>
              <Typography
                variant="overline"
                sx={{
                  color: alpha(colors.onPrimary, 0.84),
                }}
              >
                Total Balance
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    color: colors.onPrimary,
                    fontSize: { xs: '1.95rem', sm: '2.15rem' },
                    lineHeight: 1.15,
                  }}
                >
                  {formatWalletCurrency(wallet.balance, wallet.currency)}
                </Typography>
              </Stack>
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
                      void handleRefresh()
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
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    flexWrap: 'wrap',
                  }}
                >
                  <Chip
                    clickable
                    label="All"
                    onClick={() => setTransactionFilter('all')}
                    sx={getTransactionFilterChipSx(transactionFilter === 'all')}
                  />
                  <Chip
                    clickable
                    label="Credit"
                    onClick={() => setTransactionFilter('credit')}
                    sx={getTransactionFilterChipSx(transactionFilter === 'credit')}
                  />
                  <Chip
                    clickable
                    label="Debit"
                    onClick={() => setTransactionFilter('debit')}
                    sx={getTransactionFilterChipSx(transactionFilter === 'debit')}
                  />
                </Stack>

                {filteredWalletTransactions.length === 0 ? (
                  <StateCard title={getEmptyTransactionFilterTitle(transactionFilter)} />
                ) : (
                  <Stack spacing={1.25} sx={{ pb: '60vh' }}>
                    {filteredWalletTransactions.map((transaction) => (
                      <TransactionCard key={transaction.id} transaction={transaction} />
                    ))}
                  </Stack>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </PullToRefreshContainer>
    </>
  )
}

type TransactionHistoryFilter = 'all' | WalletTransactionType

function LoadingState() {
  return (
    <Stack spacing={2.25}>
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          minHeight: { xs: 108, sm: 118 },
          borderRadius: 1.5,
          px: 2.5,
          py: 2,
          background: `linear-gradient(135deg, ${colors.primaryContainer} 0%, ${colors.primary} 100%)`,
          color: colors.onPrimary,
        }}
      >
        <Stack spacing={1.1}>
          <Skeleton
            animation="wave"
            height={18}
            sx={{
              borderRadius: 1,
              bgcolor: alpha(colors.onSurface, 0.08),
              transform: 'none',
            }}
            width={88}
          />
          <Skeleton
            animation="wave"
            height={44}
            sx={{
              borderRadius: 1,
              bgcolor: alpha(colors.onSurface, 0.1),
              transform: 'none',
            }}
            width="56%"
          />
          <Skeleton
            animation="wave"
            height={18}
            sx={{
              borderRadius: 1,
              bgcolor: alpha(colors.onSurface, 0.08),
              transform: 'none',
            }}
            width="42%"
          />
        </Stack>
      </Paper>

      <Stack spacing={1.25}>
        <Skeleton animation="wave" height={24} sx={{ borderRadius: 1 }} width={148} />
        {[0, 1, 2].map((item) => (
          <Paper elevation={0} key={item} sx={stateCardSx}>
            <Stack spacing={1.1}>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Skeleton animation="wave" height={22} sx={{ borderRadius: 1 }} width="42%" />
                <Skeleton animation="wave" height={22} sx={{ borderRadius: 1 }} width={92} />
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Skeleton animation="wave" height={18} sx={{ borderRadius: 1 }} width={84} />
                <Skeleton animation="wave" height={18} sx={{ borderRadius: 1 }} width={74} />
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  )
}

function LoadingHistoryState() {
  return (
    <Stack spacing={1.25}>
      {[0, 1, 2].map((item) => (
        <Paper elevation={0} key={item} sx={stateCardSx}>
          <Stack spacing={1.1}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Skeleton animation="wave" height={22} sx={{ borderRadius: 1 }} width="44%" />
              <Skeleton animation="wave" height={22} sx={{ borderRadius: 1 }} width={88} />
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Skeleton animation="wave" height={18} sx={{ borderRadius: 1 }} width={86} />
              <Skeleton animation="wave" height={18} sx={{ borderRadius: 1 }} width={72} />
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
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
        borderRadius: 1.5,
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
            {formatWalletTransactionAmount(
              transaction.amount,
              transaction.type,
              transaction.currency,
            )}
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
  description?: string
  title: string
}

function StateCard({ action, description, title }: StateCardProps) {
  return (
    <Paper elevation={0} sx={stateCardSx}>
      <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <Typography variant="h3" sx={{ color: colors.onSurface }}>
          {title}
        </Typography>
        {description?<Typography sx={{ color: colors.onSurfaceVariant }}>{description}</Typography>:null}
        {action ?? null}
      </Stack>
    </Paper>
  )
}

function getEmptyTransactionFilterTitle(filter: TransactionHistoryFilter) {
  if (filter === 'credit') {
    return 'No credit transactions'
  }

  if (filter === 'debit') {
    return 'No debit transactions'
  }

  return 'No transaction history yet'
}

function getTransactionFilterChipSx(isActive: boolean) {
  return {
    height: 34,
    borderRadius: 999,
    border: `1px solid ${
      isActive ? colors.primaryContainer : colors.outlineVariant
    }`,
    backgroundColor: isActive
      ? colors.primaryFixed
      : colors.surfaceContainerLowest,
    color: isActive ? colors.primaryContainer : colors.onSurface,
    fontFamily: '"Lexend", sans-serif',
    fontWeight: isActive ? 700 : 500,
    '& .MuiChip-label': {
      px: 2,
      py: 0.25,
    },
  } as const
}

const stateCardSx = {
  borderRadius: 1.5,
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
