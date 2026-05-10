import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Chip,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { type ReactNode, useState } from 'react'
import { useAuthenticatedHeader } from '../../app/useAuthenticatedHeader'
import { PullToRefreshContainer } from '../../components/PullToRefreshContainer'
import { colors } from '../../colors'
import { getApiErrorMessage } from '../../lib/api/errors'
import { useWalletQuery } from '../wallet/hooks/useWalletQuery'
import { FilterSheet } from './FilterSheet'
import { usePacksQuery } from './hooks/usePacksQuery'
import { usePurchaseMutation } from './hooks/usePurchaseMutation'
import {
  formatBalance,
  formatDataAmount,
  formatValidity,
  getPackPriceValue,
} from './packFormatting'
import { PackCard } from './PackCard'
import { PurchaseSheet } from './PurchaseSheet'
import type { FilterSheetKey, Pack, PacksFilters } from './types'

export function PacksScreen() {
  const packsQuery = usePacksQuery()
  const walletQuery = useWalletQuery()
  const purchaseMutation = usePurchaseMutation()
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [filters, setFilters] = useState<PacksFilters>({})
  const [activeSheet, setActiveSheet] = useState<FilterSheetKey | null>(null)
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(
    null,
  )
  const packs = packsQuery.data ?? []
  const balance = walletQuery.data?.balanceUsd ?? 0

  useAuthenticatedHeader({
    hideBottomNavigation: selectedPack !== null,
    rightText: walletQuery.data ? formatBalance(balance) : undefined,
    title: 'Packs',
  })

  const countryOptions = Array.from(
    new Set(
      packs
        .map((pack) => pack.countryInfo?.display_name)
        .filter((countryName): countryName is string => Boolean(countryName)),
    ),
  ).sort((left, right) => left.localeCompare(right))

  const validityOptions = Array.from(
    new Set(packs.map((pack) => pack.validityInDays)),
  ).sort((left, right) => left - right)

  const dataOptions = Array.from(new Set(packs.map((pack) => pack.dataInGB))).sort(
    (left, right) => {
      if (left === -1) {
        return 1
      }
      if (right === -1) {
        return -1
      }
      return left - right
    },
  )

  const filteredPacks = packs.filter((pack) => {
    if (filters.country && pack.countryInfo?.display_name !== filters.country) {
      return false
    }
    if (
      filters.validityInDays !== undefined &&
      pack.validityInDays !== filters.validityInDays
    ) {
      return false
    }
    if (filters.dataInGB !== undefined && pack.dataInGB !== filters.dataInGB) {
      return false
    }
    return true
  })

  const hasActiveFilters =
    filters.country !== undefined ||
    filters.validityInDays !== undefined ||
    filters.dataInGB !== undefined
  const packsErrorMessage = packsQuery.isError
    ? getApiErrorMessage(
        packsQuery.error,
        'We could not load the packs catalog. Please try again.',
      )
    : ''

  async function handleBalanceRefresh() {
    await walletQuery.refetch()
  }

  function handleSelectPack(pack: Pack) {
    purchaseMutation.reset()
    setSelectedPack(pack)
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

  function updateFilter<TKey extends keyof PacksFilters>(
    key: TKey,
    value: PacksFilters[TKey],
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  return (
    <>
      <Box
        sx={{
          pb: selectedPack ? { xs: 27, sm: 31 } : 0,
        }}
      >
        <Stack spacing={2.25}>
          {packs.length > 0 ? (
            <Box
              sx={{
                position: 'sticky',
                top: { xs: '58px', sm: '62px' },
                zIndex: (theme) => theme.zIndex.appBar - 1,
                backgroundColor: colors.background,
                py: '4px',
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Chip
                  clickable
                  label={filters.country ?? 'Country'}
                  onClick={() => setActiveSheet('country')}
                  sx={getFilterChipSx(filters.country !== undefined)}
                />
                <Chip
                  clickable
                  label={
                    filters.validityInDays !== undefined
                      ? formatValidity(filters.validityInDays)
                      : 'Validity'
                  }
                  onClick={() => setActiveSheet('validityInDays')}
                  sx={getFilterChipSx(filters.validityInDays !== undefined)}
                />
                <Chip
                  clickable
                  label={
                    filters.dataInGB !== undefined
                      ? formatDataAmount(filters.dataInGB)
                      : 'GB'
                  }
                  onClick={() => setActiveSheet('dataInGB')}
                  sx={getFilterChipSx(filters.dataInGB !== undefined)}
                />
                {hasActiveFilters ? (
                  <Button
                    color="inherit"
                    onClick={() => setFilters({})}
                    size="small"
                    startIcon={<HighlightOffOutlinedIcon />}
                    sx={{
                      color: colors.primaryContainer,
                      ml: 'auto',
                      px: 1.5,
                      py: 0.25,
                      minHeight: 30,
                      border: `1px solid ${colors.outlineVariant}`,
                      borderRadius: 999,
                      backgroundColor: colors.surfaceContainerLowest,
                    }}
                    variant="outlined"
                  >
                    Clear
                  </Button>
                ) : null}
              </Stack>
            </Box>
          ) : null}

          <PullToRefreshContainer
            isPullable={selectedPack === null}
            onRefresh={handleBalanceRefresh}
          >
            <Box>
              {packsQuery.isPending ? (
              <LoadingState />
            ) : packsQuery.isError && packs.length === 0 ? (
              <StateCard
                action={
                  <Button
                    onClick={() => {
                      void packsQuery.refetch()
                    }}
                    sx={stateActionButtonSx}
                    variant="contained"
                  >
                    Retry
                  </Button>
                }
                description={packsErrorMessage}
                title="We could not load packs"
              />
            ) : packs.length === 0 ? (
              <StateCard
                description="The active catalog is empty right now. Please check again later."
                title="No active packs available"
              />
            ) : filteredPacks.length > 0 ? (
              <Stack spacing={2}>
                {filteredPacks.map((pack) => (
                  <PackCard
                    key={pack.id}
                    onSelect={() => handleSelectPack(pack)}
                    pack={pack}
                    selected={selectedPack?.id === pack.id}
                  />
                ))}
              </Stack>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  ...stateCardSx,
                }}
              >
                <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                  <Typography variant="h3" sx={{ color: colors.onSurface }}>
                    No packs match these filters
                  </Typography>
                  <Typography sx={{ color: colors.onSurfaceVariant }}>
                    Clear filters to bring the full catalog back into view.
                  </Typography>
                  <Button
                    onClick={() => setFilters({})}
                    sx={{
                      color: colors.primaryContainer,
                      alignSelf: 'center',
                      px: 2.5,
                    }}
                  >
                Clear filters
              </Button>
            </Stack>
          </Paper>
        )}
            </Box>
          </PullToRefreshContainer>
        </Stack>
      </Box>

      <FilterSheet
        hideHandle
        onClear={() => {
          updateFilter('country', undefined)
          setActiveSheet(null)
        }}
        onClose={() => setActiveSheet(null)}
        onSelect={(value) => {
          updateFilter('country', value)
          setActiveSheet(null)
        }}
        open={activeSheet === 'country'}
        options={countryOptions.map((countryName) => ({
          label: countryName,
          value: countryName,
        }))}
        selectedValue={filters.country}
        title="Country"
      />

      <FilterSheet
        hideHandle
        onClear={() => {
          updateFilter('validityInDays', undefined)
          setActiveSheet(null)
        }}
        onClose={() => setActiveSheet(null)}
        onSelect={(value) => {
          updateFilter('validityInDays', value)
          setActiveSheet(null)
        }}
        open={activeSheet === 'validityInDays'}
        options={validityOptions.map((validityInDays) => ({
          label: formatValidity(validityInDays),
          value: validityInDays,
        }))}
        selectedValue={filters.validityInDays}
        title="Validity"
      />

      <FilterSheet
        hideHandle
        onClear={() => {
          updateFilter('dataInGB', undefined)
          setActiveSheet(null)
        }}
        onClose={() => setActiveSheet(null)}
        onSelect={(value) => {
          updateFilter('dataInGB', value)
          setActiveSheet(null)
        }}
        open={activeSheet === 'dataInGB'}
        options={dataOptions.map((dataInGB) => ({
          label: formatDataAmount(dataInGB),
          value: dataInGB,
        }))}
        selectedValue={filters.dataInGB}
        title="GB"
      />

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

function getFilterChipSx(isActive: boolean) {
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
          Loading packs
        </Typography>
        <Typography sx={{ color: colors.onSurfaceVariant }}>
          Fetching the latest active catalog for this account.
        </Typography>
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
