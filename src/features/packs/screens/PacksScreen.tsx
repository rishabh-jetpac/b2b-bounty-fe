import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Fuse from 'fuse.js'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { type ReactNode, useMemo, useState } from 'react'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { PullToRefreshContainer } from '../../../components/PullToRefreshContainer'
import { colors } from '../../../colors'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { useWalletQuery } from '../../wallet/hooks/useWalletQuery'
import { FilterSheet } from '../components/FilterSheet'
import { usePacksQuery } from '../hooks/usePacksQuery'
import { usePurchaseMutation } from '../hooks/usePurchaseMutation'
import {
  formatBalance,
  formatDataAmount,
  formatValidity,
  getPackPriceValue,
} from '../utils/packFormatting'
import { PackCard } from '../components/PackCard'
import { PurchaseSheet } from '../components/PurchaseSheet'
import type { FilterSheetKey, Pack, PacksFilters } from '../types'

const EMPTY_PACKS: Pack[] = []

export function PacksScreen() {
  const packsQuery = usePacksQuery()
  const walletQuery = useWalletQuery()
  const purchaseMutation = usePurchaseMutation()
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<PacksFilters>({})
  const [activeSheet, setActiveSheet] = useState<FilterSheetKey | null>(null)
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(
    null,
  )
  const packs = packsQuery.data ?? EMPTY_PACKS
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

  const filteredPacks = useMemo(
    () =>
      packs.filter((pack) => {
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
      }),
    [filters, packs],
  )

  const normalizedSearchQuery = searchQuery.trim()
  const searchablePacks = useMemo(
    () =>
      filteredPacks.map((pack) => ({
        country: pack.countryInfo?.display_name ?? '',
        data: getPackDataSearchText(pack.dataInGB),
        pack,
        validity: getPackValiditySearchText(pack.validityInDays),
      })),
    [filteredPacks],
  )
  const packsSearch = useMemo(
    () =>
      new Fuse(searchablePacks, {
        ignoreLocation: true,
        keys: [
          { name: 'pack.name', weight: 0.65 },
          { name: 'country', weight: 0.15 },
          { name: 'data', weight: 0.1 },
          { name: 'validity', weight: 0.1 },
        ],
        threshold: 0.3,
      }),
    [searchablePacks],
  )

  const visiblePacks = normalizedSearchQuery
    ? packsSearch.search(normalizedSearchQuery).map((result) => result.item.pack)
    : filteredPacks

  const hasActiveFilters =
    filters.country !== undefined ||
    filters.validityInDays !== undefined ||
    filters.dataInGB !== undefined
  const hasSearchQuery = normalizedSearchQuery.length > 0
  const packsErrorMessage = packsQuery.isError
    ? getApiErrorMessage(
        packsQuery.error,
        'We could not load the packs catalog. Please try again.',
      )
    : ''

  async function handleBalanceRefresh() {
    await walletQuery.refetch()
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

  function updateFilter<TKey extends keyof PacksFilters>(
    key: TKey,
    value: PacksFilters[TKey],
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  function handleClearFilters() {
    setFilters({})
  }

  function handleClearSearch() {
    setSearchQuery('')
  }

  const emptyState = getEmptySearchState({
    hasActiveFilters,
    hasSearchQuery,
    onClearFilters: handleClearFilters,
    onClearSearch: handleClearSearch,
  })

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
              <Stack spacing={1}>
                <TextField
                  fullWidth
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search packs"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: hasSearchQuery ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Clear packs search"
                            edge="end"
                            onClick={() => setSearchQuery('')}
                            sx={{ color: colors.outline }}
                          >
                            <CloseRoundedIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : undefined,
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: colors.surfaceContainerLowest,
                    },
                  }}
                  value={searchQuery}
                />

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
                      onClick={handleClearFilters}
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
                      variant="outlined"
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
              ) : visiblePacks.length > 0 ? (
                <Stack spacing={2}>
                  {visiblePacks.map((pack) => (
                    <PackCard
                      key={pack.id}
                      onSelect={(isSelected) => handleSelectPack(pack, isSelected)}
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
                      {emptyState.title}
                    </Typography>
                    <Typography sx={{ color: colors.onSurfaceVariant }}>
                      {emptyState.description}
                    </Typography>
                    <Button
                      onClick={emptyState.onClear}
                      sx={{
                        alignSelf: 'center',
                        ...stateActionButtonSx,
                      }}
                      variant="outlined"
                    >
                      {emptyState.actionLabel}
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
  borderColor: colors.primary,
  color: colors.primary,
  '&:hover': {
    borderColor: colors.primary,
    backgroundColor: alpha(colors.primary, 0.04),
    color: colors.primary,
  },
} as const

type EmptySearchStateArgs = {
  hasActiveFilters: boolean
  hasSearchQuery: boolean
  onClearFilters: () => void
  onClearSearch: () => void
}

function getEmptySearchState({
  hasActiveFilters,
  hasSearchQuery,
  onClearFilters,
  onClearSearch,
}: EmptySearchStateArgs) {
  if (hasActiveFilters && hasSearchQuery) {
    return {
      actionLabel: 'Clear all',
      description: 'Clear the current search and filters to bring the full catalog back.',
      onClear: () => {
        onClearSearch()
        onClearFilters()
      },
      title: 'No packs match this search and filters',
    }
  }

  if (hasSearchQuery) {
    return {
      actionLabel: 'Clear search',
      description: 'Try a different pack or country name.',
      onClear: onClearSearch,
      title: 'No packs match this search',
    }
  }

  return {
    actionLabel: 'Clear filters',
    description: 'Clear filters to bring the full catalog back into view.',
    onClear: onClearFilters,
    title: 'No packs match these filters',
  }
}

function getPackDataSearchText(dataInGB: number) {
  if (dataInGB === -1) {
    return 'Unlimited unlimited data unlimited gb'
  }

  return `${formatDataAmount(dataInGB)} ${dataInGB} GB ${dataInGB} gigabyte ${dataInGB} gigabytes data`
}

function getPackValiditySearchText(validityInDays: number) {
  return `${formatValidity(validityInDays)} ${validityInDays} day ${validityInDays} days ${validityInDays}d validity`
}
