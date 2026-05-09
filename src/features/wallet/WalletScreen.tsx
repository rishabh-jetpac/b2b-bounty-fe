import { Box, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useAuthenticatedHeader } from '../../app/useAuthenticatedHeader'
import { colors } from '../../colors'
import { mockWalletBalance, mockWalletTransactions } from './mockWalletTransactions'
import { formatWalletAmount, formatWalletCurrency, formatWalletDate } from './walletFormatting'

export function WalletScreen() {
  useAuthenticatedHeader({
    title: 'Wallet',
  })

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
        <Box
          sx={{
            position: 'absolute',
            right: -40,
            bottom: -56,
            width: 156,
            height: 156,
            borderRadius: '50%',
            backgroundColor: alpha(colors.surfaceContainerLowest, 0.12),
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -36,
            right: 28,
            width: 92,
            height: 92,
            borderRadius: '50%',
            backgroundColor: alpha(colors.surfaceContainerLowest, 0.1),
          }}
        />

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
            {formatWalletCurrency(mockWalletBalance)}
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

        <Stack spacing={1.25}>
          {mockWalletTransactions.map((transaction) => {
            const amountColor =
              transaction.type === 'credit'
                ? colors.primaryContainer
                : colors.error

            return (
              <Paper
                key={transaction.id}
                elevation={0}
                sx={{
                  borderRadius: '8px',
                  border: `1px solid ${colors.outlineVariant}`,
                  px: 2,
                  py: 1.75,
                  boxShadow: `0 10px 24px ${alpha(colors.primary, 0.05)}`,
                }}
              >
                <Stack spacing={0.8}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      sx={{
                        color: colors.onSurface,
                        fontSize: '0.98rem',
                        fontWeight: 600,
                        lineHeight: 1.35,
                      }}
                    >
                      {transaction.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: amountColor,
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        lineHeight: 1.35,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatWalletAmount(transaction.amount, transaction.type)}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.onSurfaceVariant,
                      }}
                    >
                      {`Txn ID: ${transaction.transactionId}`}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.onSurfaceVariant,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatWalletDate(transaction.date)}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            )
          })}
        </Stack>
      </Stack>
    </Stack>
  )
}
