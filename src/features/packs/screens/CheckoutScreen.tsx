import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { useAuthStore } from '../../../store/authStore'
import { useWalletQuery } from '../../wallet/hooks/useWalletQuery'
import {
  CheckoutContent,
  CheckoutLoadingState,
  CheckoutStateView,
} from '../components/CheckoutView'
import { PacksRetryButton } from '../components/PacksStateCard'
import { useDestinationDirectoryQuery } from '../hooks/useDestinationDirectoryQuery'
import { useDestinationPacksQuery } from '../hooks/useDestinationPacksQuery'
import { usePurchaseMutation } from '../hooks/usePurchaseMutation'
import type { PacksRouteState } from '../types'
import {
  buildPurchaseSuccessMessage,
  clampCheckoutQuantity,
  MAX_PACK_PURCHASE_QUANTITY,
} from '../utils/checkoutUtils'
import { prettifyDestinationPageName } from '../utils/destinationFormatting'
import { navigateBackOrTo } from '../utils/navigation'
import { getPackPriceValue } from '../utils/packFormatting'

export function CheckoutScreen() {
  const navigate = useNavigate()
  const { pageName = '' } = useParams()
  const [searchParams] = useSearchParams()
  const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken && state.user))
  const destinationDirectoryQuery = useDestinationDirectoryQuery()
  const destinationPacksQuery = useDestinationPacksQuery(pageName)
  const walletQuery = useWalletQuery()
  const purchaseMutation = usePurchaseMutation()

  const packId = searchParams.get('packId') ?? ''
  const [quantity, setQuantity] = useState(() =>
    clampCheckoutQuantity(Number(searchParams.get('quantity'))),
  )
  const destinationTitle =
    destinationDirectoryQuery.data?.find((destination) => destination.pageName === pageName)
      ?.displayName ?? prettifyDestinationPageName(pageName)
  const pack = useMemo(
    () => destinationPacksQuery.data?.find((item) => item.id === packId) ?? null,
    [destinationPacksQuery.data, packId],
  )

  const handleBack = useCallback(() => {
    navigateBackOrTo(navigate, `/packs/${pageName}`)
  }, [navigate, pageName])
  const handleRetryWallet = useCallback(() => {
    void walletQuery.refetch()
  }, [walletQuery])

  const header = useMemo(
    () => ({
      contentPaddingBottom: '0px',
      hideBottomNavigation: true,
      leadingAction: {
        ariaLabel: `Back to ${destinationTitle} packs`,
        icon: 'back' as const,
        onClick: handleBack,
      },
      title: 'Checkout',
    }),
    [destinationTitle, handleBack],
  )

  useAuthenticatedHeader(header)

  function updateQuantity(nextQuantity: number) {
    setQuantity(clampCheckoutQuantity(nextQuantity))
  }

  async function handleConfirmPurchase() {
    if (!pack || purchaseMutation.isPending || !isAuthenticated) {
      return
    }

    try {
      const purchaseResult = await purchaseMutation.mutateAsync({
        pack_id: pack.id,
        quantity,
      })

      const state: PacksRouteState = {
        purchaseSuccessMessage: buildPurchaseSuccessMessage(
          purchaseResult.quantity,
          purchaseResult.packName,
        ),
      }

      navigate(`/packs/${pageName}`, {
        replace: true,
        state,
      })
    } catch {
      // Mutation errors are rendered inline.
    }
  }

  if (destinationPacksQuery.isPending) {
    return <CheckoutLoadingState />
  }

  if (destinationPacksQuery.isError) {
    return (
      <CheckoutStateView
        action={
          <PacksRetryButton
            onClick={() => {
              void destinationPacksQuery.refetch()
            }}
          >
            Retry
          </PacksRetryButton>
        }
        description={getApiErrorMessage(
          destinationPacksQuery.error,
          'We could not load this checkout right now. Please try again.',
        )}
        title="We could not load checkout"
      />
    )
  }

  if (!pack) {
    return (
      <CheckoutStateView
        action={<PacksRetryButton onClick={handleBack}>Back to packs</PacksRetryButton>}
        description="Pick a pack first, then continue to checkout."
        title="No pack selected"
      />
    )
  }

  const wallet = walletQuery.data
  const walletError = walletQuery.error
  const walletUnavailableMessage = walletQuery.isPending
    ? 'Loading your latest wallet balance.'
    : walletQuery.isError
      ? getApiErrorMessage(
          walletError,
          'We could not load your wallet balance. Please try again.',
        )
      : wallet === undefined
      ? 'We need your latest wallet balance before confirming this purchase.'
      : null
  const hasInsufficientBalance =
    wallet === undefined
      ? false
      : wallet.balance - getPackPriceValue(pack) * quantity < 0
  const purchaseErrorMessage = purchaseMutation.isError
    ? getApiErrorMessage(
        purchaseMutation.error,
        'We could not complete this purchase. Please try again.',
      )
    : null

  return (
    <CheckoutContent
      balance={wallet?.balance ?? null}
      canDecreaseQuantity={!purchaseMutation.isPending && quantity > 1}
      canIncreaseQuantity={
        !purchaseMutation.isPending && quantity < MAX_PACK_PURCHASE_QUANTITY
      }
      confirmDisabled={purchaseMutation.isPending || hasInsufficientBalance || wallet === undefined}
      destinationTitle={destinationTitle}
      hasInsufficientBalance={hasInsufficientBalance}
      isPending={purchaseMutation.isPending}
      onCancel={handleBack}
      onConfirmPurchase={() => {
        void handleConfirmPurchase()
      }}
      onDecreaseQuantity={() => updateQuantity(quantity - 1)}
      onIncreaseQuantity={() => updateQuantity(quantity + 1)}
      onRetryWallet={walletUnavailableMessage ? handleRetryWallet : null}
      pack={pack}
      purchaseErrorMessage={purchaseErrorMessage}
      quantity={quantity}
      walletBalanceIsLoading={walletQuery.isPending}
      walletCurrency={wallet?.currency ?? null}
      walletUnavailableMessage={walletUnavailableMessage}
    />
  )
}
