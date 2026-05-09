import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useAuthenticatedHeader } from '../../app/useAuthenticatedHeader'
import { colors } from '../../colors'
import { FilterSheet } from './FilterSheet'
import { mockPacks } from './mockPacks'
import {
  formatBalance,
  formatDataAmount,
  formatValidity,
  getPackPriceValue,
} from './packFormatting'
import { PackCard } from './PackCard'
import { PurchaseSheet } from './PurchaseSheet'
import type { FilterSheetKey, Pack, PacksFilters } from './types'

const startingBalance = 1250

export function PacksScreen() {
  const [balance, setBalance] = useState(startingBalance)
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [filters, setFilters] = useState<PacksFilters>({})
  const [activeSheet, setActiveSheet] = useState<FilterSheetKey | null>(null)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useAuthenticatedHeader({
    hideBottomNavigation: selectedPack !== null,
    rightText: formatBalance(balance),
    title: 'Packs',
  })

  const countryOptions = Array.from(
    new Set(
      mockPacks
        .map((pack) => pack.countryInfo?.display_name)
        .filter((countryName): countryName is string => Boolean(countryName)),
    ),
  ).sort((left, right) => left.localeCompare(right))

  const validityOptions = Array.from(
    new Set(mockPacks.map((pack) => pack.validityInDays)),
  ).sort((left, right) => left - right)

  const dataOptions = Array.from(new Set(mockPacks.map((pack) => pack.dataInGB))).sort(
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

  const filteredPacks = mockPacks.filter((pack) => {
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

  function handleSelectPack(pack: Pack) {
    setSelectedPack(pack)
    setQuantity(1)
  }

  function handleClosePurchaseSheet() {
    setSelectedPack(null)
    setQuantity(1)
  }

  function handlePurchase() {
    if (!selectedPack) {
      return
    }

    const totalPrice = getPackPriceValue(selectedPack) * quantity
    if (balance < totalPrice) {
      return
    }

    setBalance((currentBalance) =>
      Number((currentBalance - totalPrice).toFixed(2)),
    )
    setSnackbarMessage(`Purchased ${quantity} x ${selectedPack.name}.`)
    handleClosePurchaseSheet()
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
      <Stack
        spacing={2.25}
        sx={{
          pb: selectedPack ? { xs: 27, sm: 31 } : 0,
        }}
      >
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

        {filteredPacks.length > 0 ? (
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
              borderRadius: '8px',
              border: `1px solid ${colors.outlineVariant}`,
              px: 2.5,
              py: 3,
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
      </Stack>

      <FilterSheet
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
        onClose={handleClosePurchaseSheet}
        onDecrease={() => setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))}
        onIncrease={() => setQuantity((currentQuantity) => currentQuantity + 1)}
        onPurchase={handlePurchase}
        open={selectedPack !== null}
        pack={selectedPack}
        quantity={quantity}
      />

      <Snackbar
        autoHideDuration={3500}
        onClose={() => setSnackbarMessage('')}
        open={snackbarMessage.length > 0}
      >
        <Alert
          onClose={() => setSnackbarMessage('')}
          severity="success"
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMessage}
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
