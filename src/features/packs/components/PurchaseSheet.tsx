import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { colors } from '../../../colors'
import { BottomSheet } from './BottomSheet'
import {
  formatDataAmount,
  formatBalance,
  formatValidity,
  getPackPriceValue,
} from '../utils/packFormatting'
import type { Pack } from '../types'

type PurchaseSheetProps = {
  destinationTitle: string
  maxQuantity: number
  onClose: () => void
  onDecrease: () => void
  onCheckout: () => void
  onIncrease: () => void
  open: boolean
  pack: Pack | null
  quantity: number
}

export function PurchaseSheet({
  destinationTitle,
  maxQuantity,
  onClose,
  onDecrease,
  onCheckout,
  onIncrease,
  open,
  pack,
  quantity,
}: PurchaseSheetProps) {
  if (!pack) {
    return null
  }

  const totalPrice = getPackPriceValue(pack) * quantity
  const packTitle = `${destinationTitle} ${pack.dataInGB === -1 ? 'Unlimited' : formatDataAmount(pack.dataInGB)}`

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
                {packTitle}
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
                  disabled={quantity >= maxQuantity}
                  onClick={onIncrease}
                  sx={stepperButtonSx}
                >
                  <AddRoundedIcon />
                </IconButton>
              </Stack>
            </Box>
          </Stack>

          <Stack spacing={1}>
            <Button
              onClick={onCheckout}
              size="large"
              sx={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryContainer} 52%, ${colors.primaryContainer} 100%)`,
                color: colors.onPrimary,
                '&:hover': {
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryContainer} 52%, ${colors.primaryContainer} 100%)`,
                },
              }}
              variant="contained"
            >
              Checkout
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
