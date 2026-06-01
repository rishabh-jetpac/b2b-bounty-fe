import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EastRoundedIcon from '@mui/icons-material/EastRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { colors } from '../../../colors'
import type { Pack } from '../types'
import { formatBalance, formatValidity, getPackPriceValue } from '../utils/packFormatting'
import { buildCheckoutPackTitle } from '../utils/checkoutUtils'

type CheckoutPackCardProps = {
  destinationTitle: string
  onDecreaseQuantity: () => void
  onIncreaseQuantity: () => void
  pack: Pack
  quantity: number
  quantityDecrementDisabled: boolean
  quantityIncrementDisabled: boolean
}

type CheckoutStatusAlertsProps = {
  hasInsufficientBalance: boolean
  onRetryWallet: (() => void) | null
  purchaseErrorMessage: string | null
  walletUnavailableMessage: string | null
}

type CheckoutSummaryCardProps = {
  balanceAfterDeduction: number | null
  currentWalletBalance: number | null
  currency: string
  hasInsufficientBalance: boolean
  quantity: number
  totalDeduction: number
  unitPrice: number
}

type SummaryRowProps = {
  emphasized?: boolean
  label: string
  value: string
  valueColor?: string
  valueMuted?: boolean
}

export function CheckoutPackCard({
  destinationTitle,
  onDecreaseQuantity,
  onIncreaseQuantity,
  pack,
  quantity,
  quantityDecrementDisabled,
  quantityIncrementDisabled,
}: CheckoutPackCardProps) {
  const unitPrice = getPackPriceValue(pack)

  return (
    <Paper elevation={0} sx={checkoutCardSx}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={0.35} sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={sectionOverlineSx}>
              Selected Pack
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: colors.onSurface,
                fontSize: { xs: '1.18rem', sm: '1.28rem' },
                lineHeight: 1.18,
              }}
            >
              {buildCheckoutPackTitle(destinationTitle, pack)}
            </Typography>
            <Typography
              sx={{
                color: colors.onSurfaceVariant,
                fontSize: '0.84rem',
                lineHeight: 1.25,
              }}
            >
              {formatValidity(pack.validityInDays)} validity
            </Typography>
          </Stack>

          <Stack
            sx={{
              flexShrink: 0,
              alignItems: 'flex-end',
              textAlign: 'right',
            }}
          >
            <Typography variant="overline" sx={sectionOverlineSx}>
              Pack Price
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: colors.primaryContainer,
                fontSize: { xs: '1.28rem', sm: '1.38rem' },
                lineHeight: 1.15,
              }}
            >
              {formatBalance(unitPrice, pack.price.currency)}
            </Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            borderTop: `1px solid ${alpha(colors.outlineVariant, 0.75)}`,
            pt: 1.75,
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              sx={{
                color: colors.onSurface,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                lineHeight: 1.2,
              }}
            >
              Quantity
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
              }}
            >
              <IconButton
                aria-label="Decrease quantity"
                disabled={quantityDecrementDisabled}
                onClick={onDecreaseQuantity}
                sx={checkoutStepperButtonSx}
              >
                <RemoveRoundedIcon />
              </IconButton>
              <Typography
                sx={{
                  minWidth: 20,
                  color: colors.onSurface,
                  fontFamily: '"Lexend", sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                {quantity}
              </Typography>
              <IconButton
                aria-label="Increase quantity"
                disabled={quantityIncrementDisabled}
                onClick={onIncreaseQuantity}
                sx={checkoutStepperButtonSx}
              >
                <AddRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}

export function CheckoutSummaryCard({
  balanceAfterDeduction,
  currentWalletBalance,
  currency,
  hasInsufficientBalance,
  quantity,
  totalDeduction,
  unitPrice,
}: CheckoutSummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        borderRadius: 1.5,
        border: `1px solid ${alpha(colors.outlineVariant, 0.9)}`,
        backgroundColor: alpha(colors.primaryFixed, 0.18),
      }}
    >
      <Stack spacing={1.75} sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
        <Typography variant="overline" sx={sectionOverlineSx}>
          Transaction Summary
        </Typography>

        <Stack spacing={1.25}>
          <SummaryRow
            label="Current Wallet Balance"
            value={
              currentWalletBalance === null
                ? 'Unavailable'
                : formatBalance(currentWalletBalance, currency)
            }
            valueMuted={currentWalletBalance === null}
          />
          <SummaryRow
            label={`Pack Price (${formatBalance(unitPrice, currency)} x ${quantity})`}
            value={formatBalance(totalDeduction, currency)}
          />
        </Stack>

        <Box
          sx={{
            borderTop: `1px solid ${alpha(colors.outlineVariant, 0.75)}`,
            pt: 1.5,
          }}
        >
          <SummaryRow
            emphasized
            label="Total Deduction"
            value={`- ${formatBalance(totalDeduction, currency)}`}
            valueColor={colors.error}
          />
        </Box>
      </Stack>

      <Box
        sx={{
          borderTop: `1px solid ${alpha(colors.outlineVariant, 0.85)}`,
          backgroundColor: alpha(colors.primaryFixed, 0.34),
          px: { xs: 2, sm: 2.5 },
          py: 1.75,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              maxWidth: 160,
              color: colors.primaryContainer,
              fontSize: { xs: '0.98rem', sm: '1.05rem' },
              lineHeight: 1.2,
            }}
          >
            Balance After Deduction
          </Typography>
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: 'center',
              color: hasInsufficientBalance ? colors.error : colors.primaryContainer,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: balanceAfterDeduction === null ? colors.onSurfaceVariant : 'inherit',
                fontSize:
                  balanceAfterDeduction === null
                    ? { xs: '0.92rem', sm: '0.98rem' }
                    : { xs: '1.45rem', sm: '1.6rem' },
                lineHeight: 1.1,
              }}
            >
              {balanceAfterDeduction === null
                ? 'Unavailable'
                : formatBalance(balanceAfterDeduction, currency)}
            </Typography>
            {balanceAfterDeduction === null ? null : <EastRoundedIcon sx={{ fontSize: 22 }} />}
          </Stack>
        </Stack>
      </Box>
    </Paper>
  )
}

export function CheckoutStatusAlerts({
  hasInsufficientBalance,
  onRetryWallet,
  purchaseErrorMessage,
  walletUnavailableMessage,
}: CheckoutStatusAlertsProps) {
  return (
    <>
      {walletUnavailableMessage ? (
        <Alert
          action={
            onRetryWallet ? (
              <Button color="inherit" onClick={onRetryWallet} size="small">
                Retry
              </Button>
            ) : undefined
          }
          severity="warning"
          variant="outlined"
        >
          {walletUnavailableMessage}
        </Alert>
      ) : null}

      {hasInsufficientBalance ? (
        <Alert severity="error" variant="outlined">
          Your wallet balance is too low for this purchase.
        </Alert>
      ) : null}

      {purchaseErrorMessage ? (
        <Alert severity="error" variant="outlined">
          {purchaseErrorMessage}
        </Alert>
      ) : null}
    </>
  )
}

function SummaryRow({
  emphasized = false,
  label,
  value,
  valueColor,
  valueMuted = false,
}: SummaryRowProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        sx={{
          color: emphasized ? colors.onSurface : colors.onSurfaceVariant,
          fontFamily: emphasized ? '"Lexend", sans-serif' : '"Inter", sans-serif',
          fontSize: emphasized ? { xs: '1rem', sm: '1.05rem' } : { xs: '0.88rem', sm: '0.92rem' },
          fontWeight: emphasized ? 700 : 500,
          lineHeight: 1.25,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: valueMuted ? colors.onSurfaceVariant : (valueColor ?? colors.onSurface),
          fontFamily: emphasized ? '"Lexend", sans-serif' : '"Inter", sans-serif',
          fontSize: emphasized ? { xs: '1.05rem', sm: '1.1rem' } : { xs: '0.9rem', sm: '0.95rem' },
          fontWeight: emphasized ? 700 : 500,
          lineHeight: 1.2,
          textAlign: 'right',
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

const sectionOverlineSx = {
  color: colors.onSurfaceVariant,
  letterSpacing: '0.14em',
  fontSize: '0.68rem',
  lineHeight: 1.15,
} as const

const checkoutCardSx = {
  borderRadius: 2.5,
  border: `1px solid ${colors.outlineVariant}`,
  backgroundColor: colors.surfaceContainerLowest,
  px: { xs: 2, sm: 2.5 },
  py: 2,
} as const

const checkoutStepperButtonSx = {
  width: 32,
  height: 32,
  border: `1px solid ${alpha(colors.primaryContainer, 0.2)}`,
  backgroundColor: colors.surfaceContainerLowest,
  color: colors.onSurfaceVariant,
  '&:hover': {
    backgroundColor: colors.surfaceContainerLowest,
  },
  '&.Mui-disabled': {
    color: colors.outlineVariant,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
} as const
