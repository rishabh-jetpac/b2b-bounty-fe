import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { colors } from '../../../colors'
import type { Pack } from '../types'
import { getPackPriceValue } from '../utils/packFormatting'
import {
  CheckoutPackCard,
  CheckoutStatusAlerts,
  CheckoutSummaryCard,
} from './CheckoutCards'
import { PacksStateCard } from './PacksStateCard'

export type CheckoutContentProps = {
  balanceUsd: number | null
  canDecreaseQuantity: boolean
  canIncreaseQuantity: boolean
  confirmDisabled: boolean
  destinationTitle: string
  hasInsufficientBalance: boolean
  isPending: boolean
  onCancel: () => void
  onConfirmPurchase: () => void
  onDecreaseQuantity: () => void
  onIncreaseQuantity: () => void
  onRetryWallet: (() => void) | null
  pack: Pack
  purchaseErrorMessage: string | null
  quantity: number
  walletUnavailableMessage: string | null
}

type CheckoutStateViewProps = {
  action?: ReactNode
  description: string
  title: string
}

type CheckoutFooterProps = {
  confirmDisabled: boolean
  isPending: boolean
  onCancel: () => void
  onConfirmPurchase: () => void
}

type CheckoutStateContainerProps = {
  children: ReactNode
}

export function CheckoutContent({
  balanceUsd,
  canDecreaseQuantity,
  canIncreaseQuantity,
  confirmDisabled,
  destinationTitle,
  hasInsufficientBalance,
  isPending,
  onCancel,
  onConfirmPurchase,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRetryWallet,
  pack,
  purchaseErrorMessage,
  quantity,
  walletUnavailableMessage,
}: CheckoutContentProps) {
  const unitPrice = getPackPriceValue(pack)
  const totalDeduction = unitPrice * quantity
  const balanceAfterDeduction = balanceUsd === null ? null : balanceUsd - totalDeduction

  return (
    <Stack sx={checkoutContentSx}>
      <Box sx={checkoutScrollableContentSx}>
        <Stack spacing={2}>
          <CheckoutPackCard
            destinationTitle={destinationTitle}
            onDecreaseQuantity={onDecreaseQuantity}
            onIncreaseQuantity={onIncreaseQuantity}
            pack={pack}
            quantity={quantity}
            quantityDecrementDisabled={!canDecreaseQuantity}
            quantityIncrementDisabled={!canIncreaseQuantity}
          />

          <CheckoutSummaryCard
            balanceAfterDeduction={balanceAfterDeduction}
            currentWalletBalance={balanceUsd}
            hasInsufficientBalance={hasInsufficientBalance}
            quantity={quantity}
            totalDeduction={totalDeduction}
            unitPrice={unitPrice}
            currency={pack.price.currency}
          />

          <CheckoutStatusAlerts
            hasInsufficientBalance={hasInsufficientBalance}
            onRetryWallet={onRetryWallet}
            purchaseErrorMessage={purchaseErrorMessage}
            walletUnavailableMessage={walletUnavailableMessage}
          />
        </Stack>
      </Box>

      <CheckoutFooter
        confirmDisabled={confirmDisabled}
        isPending={isPending}
        onCancel={onCancel}
        onConfirmPurchase={onConfirmPurchase}
      />
    </Stack>
  )
}

export function CheckoutLoadingState() {
  return (
    <CheckoutStateContainer>
      <Stack
        spacing={1.5}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40svh',
        }}
      >
        <CircularProgress />
        <Typography
          sx={{
            color: colors.onSurfaceVariant,
          }}
        >
          Loading checkout...
        </Typography>
      </Stack>
    </CheckoutStateContainer>
  )
}

export function CheckoutStateView({ action, description, title }: CheckoutStateViewProps) {
  return (
    <CheckoutStateContainer>
      <PacksStateCard action={action} description={description} title={title} />
    </CheckoutStateContainer>
  )
}

function CheckoutFooter({
  confirmDisabled,
  isPending,
  onCancel,
  onConfirmPurchase,
}: CheckoutFooterProps) {
  return (
    <Box sx={checkoutFooterSx}>
      <Stack spacing={0.85}>
        <Button
          disabled={confirmDisabled}
          onClick={onConfirmPurchase}
          size="large"
          sx={{
            backgroundColor: colors.primaryContainer,
            '&:hover': {
              backgroundColor: colors.primary,
            },
          }}
          variant="contained"
        >
          {isPending ? 'Confirming Purchase...' : 'Confirm Purchase'}
        </Button>
        <Button
          color="inherit"
          disabled={isPending}
          onClick={onCancel}
          sx={{
            borderColor: colors.outlineVariant,
            color: colors.onSurfaceVariant,
            '&:hover': {
              borderColor: colors.onSurfaceVariant,
              backgroundColor: colors.surfaceContainerLow,
            },
          }}
          variant="outlined"
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  )
}

function CheckoutStateContainer({ children }: CheckoutStateContainerProps) {
  return <Box sx={checkoutStateContainerSx}>{children}</Box>
}

const checkoutContentSx = {
  height: {
    xs: 'calc(100svh - 58px)',
    sm: 'calc(100svh - 62px)',
  },
  minHeight: 0,
  overflow: 'hidden',
  backgroundColor: colors.surfaceContainerLowest,
} as const

const checkoutScrollableContentSx = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  pb: 2,
} as const

const checkoutFooterSx = {
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  flexShrink: 0,
  borderTop: `1px solid ${alpha(colors.outlineVariant, 0.95)}`,
  backgroundColor: colors.surfaceContainerLowest,
  px: 0,
  pt: 1.5,
  pb: 'calc(24px + env(safe-area-inset-bottom))',
} as const

const checkoutStateContainerSx = {
  minHeight: {
    xs: 'calc(100svh - 58px)',
    sm: 'calc(100svh - 62px)',
  },
  display: 'flex',
  alignItems: 'center',
} as const
