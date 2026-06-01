import { useVirtualizer } from '@tanstack/react-virtual'
import Fuse from 'fuse.js'
import { Box, Stack } from '@mui/material'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { colors } from '../../../colors'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { DestinationCard } from '../components/DestinationCard'
import { DestinationSearchField } from '../components/DestinationSearchField'
import {
  DestinationListSkeleton,
  PacksRetryButton,
  PacksStateCard,
} from '../components/PacksStateCard'
import { useDestinationDirectoryQuery } from '../hooks/useDestinationDirectoryQuery'
import type { Destination } from '../types'
import { normalizeSearchQuery } from '../utils/destinationFormatting'
import { navigateBackOrTo } from '../utils/navigation'

const EMPTY_DESTINATIONS: Destination[] = []
const CARD_HEIGHT = 108
const CARD_GAP = 14
const ROW_HEIGHT = CARD_HEIGHT + CARD_GAP

export function PacksScreen() {
  const navigate = useNavigate()
  const destinationsQuery = useDestinationDirectoryQuery()
  const [searchQuery, setSearchQuery] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const handleBack = useCallback(() => {
    navigateBackOrTo(navigate, '/')
  }, [navigate])

  const header = useMemo(
    () => ({
      contentPaddingBottom: '0px',
      leadingAction: {
        ariaLabel: 'Go back',
        icon: 'back' as const,
        onClick: handleBack,
      },
      title: 'Packs',
    }),
    [handleBack],
  )

  useAuthenticatedHeader(header)

  const destinations = destinationsQuery.data ?? EMPTY_DESTINATIONS
  const normalizedSearch = normalizeSearchQuery(searchQuery)

  const searchableDestinations = useMemo(
    () =>
      destinations.map((destination) => ({
        destination,
        displayName: destination.displayName,
        pageName: destination.pageName.replace(/-/g, ' '),
      })),
    [destinations],
  )
  const destinationsSearch = useMemo(
    () =>
      new Fuse(searchableDestinations, {
        ignoreLocation: true,
        keys: [
          { name: 'displayName', weight: 0.7 },
          { name: 'pageName', weight: 0.3 },
        ],
        threshold: 0.3,
      }),
    [searchableDestinations],
  )

  const visibleDestinations = useMemo(
    () =>
      normalizedSearch
        ? destinationsSearch.search(normalizedSearch).map((result) => result.item.destination)
        : destinations,
    [destinations, destinationsSearch, normalizedSearch],
  )

  const rowVirtualizer = useVirtualizer({
    count: visibleDestinations.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => scrollRef.current,
    overscan: 10,
  })

  const destinationsErrorMessage = destinationsQuery.isError
    ? getApiErrorMessage(
        destinationsQuery.error,
        'We could not load destinations right now. Please try again.',
      )
    : ''

  return (
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
          ref={scrollRef}
          sx={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            backgroundColor: colors.surfaceContainerLowest,
          }}
        >
          <DestinationSearchField
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            value={searchQuery}
          />

          <Box
            sx={{
              px: 0.5,
              pb: { xs: 4, sm: 5 },
            }}
          >
            {destinationsQuery.isPending ? (
              <DestinationListSkeleton />
            ) : destinationsQuery.isError && destinations.length === 0 ? (
              <PacksStateCard
                action={
                  <PacksRetryButton
                    onClick={() => {
                      void destinationsQuery.refetch()
                    }}
                  >
                    Retry
                  </PacksRetryButton>
                }
                description={destinationsErrorMessage}
                title="We could not load destinations"
              />
            ) : destinations.length === 0 ? (
              <PacksStateCard
                description="The destination directory is empty right now. Please check again later."
                title="No destinations available"
              />
            ) : visibleDestinations.length === 0 ? (
              <PacksStateCard
                action={
                  <PacksRetryButton onClick={() => setSearchQuery('')}>
                    Clear search
                  </PacksRetryButton>
                }
                description="Try a different destination name or clear the current search."
                title="No destinations match this search"
              />
            ) : (
              <Box
                sx={{
                  pt: 2,
                }}
              >
                <Box
                  sx={{
                    height: `${Math.max(0, rowVirtualizer.getTotalSize() - CARD_GAP)}px`,
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const destination = visibleDestinations[virtualRow.index]

                    return (
                      <Box
                        key={destination.pageName}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <DestinationCard
                          destination={destination}
                          onClick={() => navigate(`/packs/${destination.pageName}`)}
                        />
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Stack>
    </Stack>
  )
}
