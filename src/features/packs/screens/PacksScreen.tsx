import { useVirtualizer } from '@tanstack/react-virtual'
import Fuse from 'fuse.js'
import { Box, Stack } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { DestinationCard } from '../components/DestinationCard'
import { DestinationSearchField } from '../components/DestinationSearchField'
import { PacksLoadingState, PacksRetryButton, PacksStateCard } from '../components/PacksStateCard'
import { useDestinationDirectoryQuery } from '../hooks/useDestinationDirectoryQuery'
import type { Destination } from '../types'
import { normalizeSearchQuery } from '../utils/destinationFormatting'

const EMPTY_DESTINATIONS: Destination[] = []
const CARD_HEIGHT = 108
const CARD_GAP = 14
const ROW_HEIGHT = CARD_HEIGHT + CARD_GAP

export function PacksScreen() {
  const navigate = useNavigate()
  const destinationsQuery = useDestinationDirectoryQuery()
  const [searchQuery, setSearchQuery] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useAuthenticatedHeader({
    contentPaddingBottom: '0px',
    title: 'Packs',
  })

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
      }}
    >
      <Stack
        sx={{
          height: '100%',
          minHeight: 0,
        }}
      >
        <Box
          ref={scrollRef}
          sx={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            backgroundColor: 'transparent',
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
              pb: 2,
            }}
          >
            {destinationsQuery.isPending ? (
              <PacksLoadingState
                description="Fetching the latest destination directory for this account."
                title="Loading destinations"
              />
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
