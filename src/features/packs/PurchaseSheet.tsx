import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { colors } from '../../colors'
import { BottomSheet } from './BottomSheet'
import {
  formatBalance,
  formatValidity,
  getPackPriceValue,
} from './packFormatting'
import type { Pack } from './types'

type PurchaseSheetProps = {
  balance: number
  errorMessage?: string
  isBalancePending: boolean
  isPending: boolean
  onClose: () => void
  onDecrease: () => void
  onIncrease: () => void
  onPurchase: () => void
  open: boolean
  pack: Pack | null
  quantity: number
}

export function PurchaseSheet({
  balance,
  errorMessage,
  isBalancePending,
  isPending,
  onClose,
  onDecrease,
  onIncrease,
  onPurchase,
  open,
  pack,
  quantity,
}: PurchaseSheetProps) {
  if (!pack) {
    return null
  }

  const totalPrice = getPackPriceValue(pack) * quantity
  const hasInsufficientBalance = !isBalancePending && balance < totalPrice

  return (
    <BottomSheet
      allowBackgroundInteraction={!isPending}
      fullWidth
      hideHandle
      onClose={isPending ? noop : onClose}
      open={open}
      showCloseButton={false}
      showHeader={false}
    >
      <Box sx={{ position: 'relative', pt: 1 }}>
        <IconButton
          aria-label="Close purchase sheet"
          disabled={isPending}
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: -4,
            right: -8,
            color: colors.onSurfaceVariant,
          }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <Stack spacing={2.5}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <Stack spacing={0.5}>
              <Typography
                variant="h3"
                sx={{
                  color: colors.onSurface,
                }}
              >
                {pack.name}
              </Typography>
              <Typography
                variant="overline"
                sx={{
                  color: colors.onSurfaceVariant,
                }}
              >
                {formatValidity(pack.validityInDays)} validity
              </Typography>
              <Typography
                sx={{
                  color: colors.primaryContainer,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                {formatBalance(totalPrice, pack.price.currency)}
              </Typography>
            </Stack>

            <Box
              sx={{
                pt: 4,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: 'center',
                  px: 1,
                  py: 0.5,
                  borderRadius: 999,
                  border: `1px solid ${colors.outlineVariant}`,
                  backgroundColor: colors.surfaceContainerLowest,
                }}
              >
                <IconButton
                  aria-label="Decrease quantity"
                  disabled={isPending || quantity === 1}
                  onClick={onDecrease}
                  sx={stepperButtonSx}
                >
                  <RemoveRoundedIcon />
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 28,
                    color: colors.onSurface,
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  {quantity}
                </Typography>
                <IconButton
                  aria-label="Increase quantity"
                  disabled={isPending}
                  onClick={onIncrease}
                  sx={stepperButtonSx}
                >
                  <AddRoundedIcon />
                </IconButton>
              </Stack>
            </Box>
          </Stack>

          {isBalancePending ? (
            <Alert severity="info" variant="outlined">
              Refreshing wallet balance before purchase.
            </Alert>
          ) : null}

          {hasInsufficientBalance ? (
            <Alert
              severity="warning"
              sx={{
                border: `1px solid ${alpha(colors.secondaryContainer, 0.5)}`,
                backgroundColor: alpha(colors.secondaryFixed, 0.55),
                color: colors.onSurface,
              }}
            >
              Balance {formatBalance(balance)} is not enough for this purchase.
            </Alert>
          ) : null}

          {errorMessage ? (
            <Alert severity="error" variant="outlined">
              {errorMessage}
            </Alert>
          ) : null}

          <Stack spacing={1}>
            <Button
              disabled={isPending || isBalancePending || hasInsufficientBalance}
              onClick={onPurchase}
              size="large"
              sx={{
                backgroundColor: colors.primaryContainer,
                '&:hover': {
                  backgroundColor: colors.primary,
                },
              }}
              variant="contained"
            >
              {isPending ? 'Purchasing...' : 'Buy now'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </BottomSheet>
  )
}

const stepperButtonSx = {
  width: 32,
  height: 32,
  border: `1px solid ${colors.primaryFixedDim}`,
  color: colors.primaryContainer,
  '&.Mui-disabled': {
    color: colors.outlineVariant,
    borderColor: colors.outlineVariant,
  },
} as const

function noop() {}
