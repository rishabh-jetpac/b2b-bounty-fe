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
  formatPackPrice,
  formatValidity,
  getPackPriceValue,
} from './packFormatting'
import type { Pack } from './types'

type PurchaseSheetProps = {
  balance: number
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
  const hasInsufficientBalance = balance < totalPrice

  return (
    <BottomSheet
      allowBackgroundInteraction
      fullWidth
      hideHandle
      onClose={onClose}
      open={open}
      showCloseButton={false}
      showHeader={false}
    >
      <Box sx={{ position: 'relative', pt: 1 }}>
        <IconButton
          aria-label="Close purchase sheet"
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
                {formatPackPrice(pack)}
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
                  disabled={quantity === 1}
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
                  onClick={onIncrease}
                  sx={stepperButtonSx}
                >
                  <AddRoundedIcon />
                </IconButton>
              </Stack>
            </Box>
          </Stack>

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

          <Stack spacing={1}>
            <Button
              disabled={hasInsufficientBalance}
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
              Buy now
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
