import { Box, Chip, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router'
import type { AppShellOutletContext } from '../../../app/useAuthenticatedHeader'
import { colors } from '../../../colors'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { PackCard } from '../components/PackCard'
import {
  DestinationPacksSkeleton,
  PacksRetryButton,
  PacksStateCard,
} from '../components/PacksStateCard'
import { PurchaseSheet } from '../components/PurchaseSheet'
import { useDestinationDirectoryQuery } from '../hooks/useDestinationDirectoryQuery'
import { useDestinationPacksQuery } from '../hooks/useDestinationPacksQuery'
import type { Pack } from '../types'
import {
  ALL_DESTINATION_PACKS_FILTER,
  buildDestinationPackFilterOptions,
  filterDestinationPackSections,
  getActiveDestinationPackFilter,
} from '../utils/destinationPackFilters'
import { buildDestinationPackSections } from '../utils/destinationPackSections'
import { prettifyDestinationPageName } from '../utils/destinationFormatting'
import { navigateBackOrTo } from '../utils/navigation'

const EMPTY_PACKS: Pack[] = []
const MAX_PACK_PURCHASE_QUANTITY = 20

export function DestinationPacksScreen() {
  const navigate = useNavigate()
  const { setHeader } = useOutletContext<AppShellOutletContext>()
  const { pageName = '' } = useParams()
  const destinationDirectoryQuery = useDestinationDirectoryQuery()
  const destinationPacksQuery = useDestinationPacksQuery(pageName)
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState<string>(ALL_DESTINATION_PACKS_FILTER)

  const packs = destinationPacksQuery.data ?? EMPTY_PACKS
  const sections = useMemo(() => buildDestinationPackSections(packs), [packs])
  const filterOptions = useMemo(() => buildDestinationPackFilterOptions(sections), [sections])
  const activeFilter = useMemo(
    () => getActiveDestinationPackFilter(selectedFilter, filterOptions),
    [filterOptions, selectedFilter],
  )
  const filteredSections = useMemo(
    () => filterDestinationPackSections(sections, activeFilter),
    [activeFilter, sections],
  )
  const destinationTitle =
    destinationDirectoryQuery.data?.find((destination) => destination.pageName === pageName)
      ?.displayName ?? prettifyDestinationPageName(pageName)

  const handleBack = useCallback(() => {
    navigateBackOrTo(navigate, '/packs')
  }, [navigate])

  useEffect(() => {
    setHeader({
      contentPaddingBottom: '0px',
      leadingAction: {
        ariaLabel: 'Back to destinations',
        icon: 'back',
        onClick: handleBack,
      },
      title: destinationTitle,
    })
  }, [destinationTitle, handleBack, setHeader])

  const packsErrorMessage = destinationPacksQuery.isError
    ? getApiErrorMessage(
        destinationPacksQuery.error,
        'We could not load packs for this destination. Please try again.',
      )
    : ''

  function handleSelectPack(pack: Pack, isSelected: boolean) {
    setSelectedPack(isSelected ? null : pack)
    setQuantity(1)
  }

  function handleClosePurchaseSheet() {
    setSelectedPack(null)
    setQuantity(1)
  }

  function handleFilterChange(nextFilter: string) {
    setSelectedFilter(nextFilter)
  }

  function handleCheckout() {
    if (!selectedPack) {
      return
    }

    navigate(`/packs/${pageName}/checkout?packId=${selectedPack.id}&quantity=${quantity}`)
  }

  return (
    <>
      <Stack
        sx={{
          height: {
            xs: 'calc(100svh - 58px - 74px - env(safe-area-inset-bottom))',
            sm: 'calc(100svh - 62px - 74px - env(safe-area-inset-bottom))',
          },
          minHeight: 0,
          overflow: 'hidden',
          backgroundColor: colors.surfaceContainerLowest,
        }}
      >
        <Stack
          sx={{
            height: '100%',
            minHeight: 0,
            backgroundColor: colors.surfaceContainerLowest,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              backgroundColor: colors.surfaceContainerLowest,
              pb: selectedPack ? { xs: 27, sm: 31 } : { xs: 4, sm: 5 },
            }}
          >
            {destinationPacksQuery.isPending ? (
              <DestinationPacksSkeleton />
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
              <Stack spacing={2.5} sx={{ px: 0.5, pb: 1 }}>
                <Box
                  sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    px: 0.25,
                    pt: 0.5,
                    pb: 1,
                    backgroundColor: colors.surfaceContainerLowest,
                  }}
                >
                  <Box
                    sx={{
                      overflowX: 'auto',
                      pb: 0.25,
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{
                        width: 'max-content',
                        minWidth: 'fit-content',
                        mx: 'auto',
                        p: 0.45,
                        borderRadius: 999,
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      {filterOptions.map((filterOption) => (
                        <Chip
                          clickable
                          key={filterOption.key}
                          label={filterOption.label}
                          onClick={() => handleFilterChange(filterOption.key)}
                          sx={{
                            height: 34,
                            width: 96,
                            borderRadius: 999,
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            letterSpacing: '0.015em',
                            transition:
                              'background-color 150ms ease, border-color 150ms ease, color 150ms ease, transform 150ms ease',
                            color:
                              activeFilter === filterOption.key
                                ? colors.onPrimary
                                : colors.onSurfaceVariant,
                            border:
                              activeFilter === filterOption.key
                                ? `1px solid ${alpha(colors.primaryContainer, 0.36)}`
                                : `1px solid ${alpha(colors.outlineVariant, 0.95)}`,
                            background:
                              activeFilter === filterOption.key
                                ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryContainer} 52%, ${colors.primaryContainer} 100%)`
                                : colors.surfaceContainerLowest,
                            transform:
                              activeFilter === filterOption.key ? 'translateY(-1px)' : 'none',
                            '& .MuiChip-label': {
                              px: 1,
                              width: '100%',
                              textAlign: 'center',
                            },
                            '&:hover': {
                              background:
                                activeFilter === filterOption.key
                                  ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryContainer} 52%, ${colors.primaryContainer} 100%)`
                                  : colors.surfaceContainerLowest,
                            },
                          }}
                          variant="filled"
                        />
                      ))}
                    </Stack>
                  </Box>
                </Box>

                {filteredSections.map((section) => (
                  <Stack
                    key={section.kind === 'unlimited' ? section.kind : section.validityInDays}
                    spacing={1.25}
                    sx={{ px: 0.25 }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Stack spacing={0.2}>
                        <Typography
                          variant="overline"
                          sx={{
                            color:
                              section.kind === 'unlimited'
                                ? colors.primaryContainer
                                : colors.onSurface,
                            fontSize: { xs: '1rem', sm: '1.08rem' },
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            lineHeight: 1.1,
                          }}
                        >
                          {section.title}
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          flexShrink: 0,
                          px: 1.1,
                          py: 0.55,
                          borderRadius: 999,
                          border: `1px solid ${alpha(colors.outlineVariant, 0.75)}`,
                          backgroundColor: colors.surfaceContainerLowest,
                        }}
                      >
                        <Typography
                          sx={{
                            color: alpha(colors.onSurfaceVariant, 0.82),
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}
                        >
                          {section.packs.length} {section.packs.length === 1 ? 'plan' : 'plans'}
                        </Typography>
                      </Box>
                    </Stack>
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
        </Stack>
      </Stack>

      <PurchaseSheet
        destinationTitle={destinationTitle}
        maxQuantity={MAX_PACK_PURCHASE_QUANTITY}
        onClose={handleClosePurchaseSheet}
        onDecrease={() => setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))}
        onCheckout={handleCheckout}
        onIncrease={() =>
          setQuantity((currentQuantity) =>
            Math.min(MAX_PACK_PURCHASE_QUANTITY, currentQuantity + 1),
          )
        }
        open={selectedPack !== null}
        pack={selectedPack}
        quantity={quantity}
      />
    </>
  )
}
