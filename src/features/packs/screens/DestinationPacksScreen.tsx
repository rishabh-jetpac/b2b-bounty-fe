import { Alert, Box, Snackbar, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { PullToRefreshContainer } from '../../../components/PullToRefreshContainer'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { useWalletQuery } from '../../wallet/hooks/useWalletQuery'
import { PackCard } from '../components/PackCard'
import { PacksLoadingState, PacksRetryButton, PacksStateCard } from '../components/PacksStateCard'
import { PurchaseSheet } from '../components/PurchaseSheet'
import { useDestinationDirectoryQuery } from '../hooks/useDestinationDirectoryQuery'
import { useDestinationPacksQuery } from '../hooks/useDestinationPacksQuery'
import { usePurchaseMutation } from '../hooks/usePurchaseMutation'
import type { Pack } from '../types'
import { buildDestinationPackSections } from '../utils/destinationPackSections'
import { prettifyDestinationPageName } from '../utils/destinationFormatting'
import { formatBalance, getPackPriceValue } from '../utils/packFormatting'

const EMPTY_PACKS: Pack[] = []

export function DestinationPacksScreen() {
  const navigate = useNavigate()
  const { pageName = '' } = useParams()
  const destinationDirectoryQuery = useDestinationDirectoryQuery()
  const destinationPacksQuery = useDestinationPacksQuery(pageName)
  const walletQuery = useWalletQuery()
  const purchaseMutation = usePurchaseMutation()
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null)

  const packs = destinationPacksQuery.data ?? EMPTY_PACKS
  const sections = useMemo(() => buildDestinationPackSections(packs), [packs])
  const balance = walletQuery.data?.balanceUsd ?? 0
  const destinationTitle =
    destinationDirectoryQuery.data?.find((destination) => destination.pageName === pageName)
      ?.displayName ?? prettifyDestinationPageName(pageName)

  useAuthenticatedHeader({
    leadingAction: {
      ariaLabel: 'Back to destinations',
      icon: 'back',
      onClick: () => navigate('/packs'),
    },
    rightText: walletQuery.data ? formatBalance(balance) : undefined,
    title: destinationTitle,
  })

  const packsErrorMessage = destinationPacksQuery.isError
    ? getApiErrorMessage(
        destinationPacksQuery.error,
        'We could not load packs for this destination. Please try again.',
      )
    : ''

  async function handleRefresh() {
    await Promise.all([
      destinationPacksQuery.refetch(),
      walletQuery.refetch(),
      destinationDirectoryQuery.refetch(),
    ])
  }

  function handleSelectPack(pack: Pack, isSelected: boolean) {
    purchaseMutation.reset()
    setSelectedPack(isSelected ? null : pack)
    setQuantity(1)
  }

  function handleClosePurchaseSheet() {
    purchaseMutation.reset()
    setSelectedPack(null)
    setQuantity(1)
  }

  async function handlePurchase() {
    if (!selectedPack || !walletQuery.data || purchaseMutation.isPending) {
      return
    }

    const totalPrice = getPackPriceValue(selectedPack) * quantity

    if (balance < totalPrice) {
      return
    }

    try {
      const purchaseResult = await purchaseMutation.mutateAsync({
        pack_id: selectedPack.id,
        quantity,
      })

      handleClosePurchaseSheet()
      setPurchaseSuccessMessage(
        `Purchased ${purchaseResult.quantity} x ${purchaseResult.packName} successfully.`,
      )
      void walletQuery.refetch()
    } catch {
      // The mutation state is rendered inline in the purchase sheet.
    }
  }

  return (
    <>
      <PullToRefreshContainer
        isPullable={selectedPack === null}
        onRefresh={handleRefresh}
      >
        <Box
          sx={{
            pb: selectedPack ? { xs: 27, sm: 31 } : 0,
          }}
        >
          {destinationPacksQuery.isPending ? (
            <PacksLoadingState
              description={`Fetching the latest packs for ${destinationTitle}.`}
              title="Loading packs"
            />
          ) : destinationPacksQuery.isError && packs.length === 0 ? (
            <PacksStateCard
              action={
                <PacksRetryButton
                  onClick={() => {
                    void destinationPacksQuery.refetch()
                  }}
                >
                  Retry
                </PacksRetryButton>
              }
              description={packsErrorMessage}
              title="We could not load packs"
            />
          ) : packs.length === 0 ? (
            <PacksStateCard
              description="No active packs are available for this destination right now."
              title="No packs available"
            />
          ) : (
            <Stack spacing={2.5}>
              {sections.map((section) => (
                <Stack key={section.kind === 'unlimited' ? section.kind : section.validityInDays} spacing={1.25}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: section.kind === 'unlimited' ? 'primary.main' : 'text.secondary',
                      fontSize: '0.82rem',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Stack spacing={1.25}>
                    {section.packs.map((pack) => (
                      <PackCard
                        key={pack.id}
                        onSelect={(isSelected) => handleSelectPack(pack, isSelected)}
                        pack={pack}
                        selected={selectedPack?.id === pack.id}
                      />
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      </PullToRefreshContainer>

      <PurchaseSheet
        balance={balance}
        errorMessage={
          purchaseMutation.isError
            ? getApiErrorMessage(
                purchaseMutation.error,
                'We could not complete this purchase. Please try again.',
              )
            : undefined
        }
        isBalancePending={walletQuery.isPending}
        isPending={purchaseMutation.isPending}
        onClose={handleClosePurchaseSheet}
        onDecrease={() => setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))}
        onIncrease={() => setQuantity((currentQuantity) => currentQuantity + 1)}
        onPurchase={handlePurchase}
        open={selectedPack !== null}
        pack={selectedPack}
        quantity={quantity}
      />

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2500}
        onClose={() => setPurchaseSuccessMessage(null)}
        open={purchaseSuccessMessage !== null}
      >
        <Alert
          onClose={() => setPurchaseSuccessMessage(null)}
          severity="success"
          sx={{ width: '100%' }}
          variant="filled"
        >
          {purchaseSuccessMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
