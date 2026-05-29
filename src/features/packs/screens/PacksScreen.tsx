import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useVirtualizer } from '@tanstack/react-virtual'
import Fuse from 'fuse.js'
import {
  Box,
  ButtonBase,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { PullToRefreshContainer } from '../../../components/PullToRefreshContainer'
import { colors } from '../../../colors'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { PacksLoadingState, PacksRetryButton, PacksStateCard } from '../components/PacksStateCard'
import { useDestinationDirectoryQuery } from '../hooks/useDestinationDirectoryQuery'
import type { Destination } from '../types'
import { normalizeSearchQuery } from '../utils/destinationFormatting'

const EMPTY_DESTINATIONS: Destination[] = []
const ROW_HEIGHT = 68

export function PacksScreen() {
  const navigate = useNavigate()
  const destinationsQuery = useDestinationDirectoryQuery()
  const [searchQuery, setSearchQuery] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useAuthenticatedHeader({
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

  const visibleDestinations = normalizedSearch
    ? destinationsSearch.search(normalizedSearch).map((result) => result.item.destination)
    : destinations

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

  async function handleRefresh() {
    await destinationsQuery.refetch()
  }

  return (
    <PullToRefreshContainer onRefresh={handleRefresh}>
      <Stack spacing={2.25}>
        <TextField
          fullWidth
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search destinations"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
              endAdornment: normalizedSearch ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Clear destination search"
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
          <Paper
            elevation={0}
            sx={{
              overflow: 'hidden',
              borderRadius: '8px',
              border: `1px solid ${colors.outlineVariant}`,
              boxShadow: `0 10px 24px ${alpha(colors.primary, 0.05)}`,
            }}
          >
            <Box
              ref={scrollRef}
              sx={{
                height: {
                  xs: 'clamp(320px, calc(100svh - 244px), 640px)',
                  sm: 'clamp(360px, calc(100svh - 256px), 720px)',
                },
                overflowY: 'auto',
              }}
            >
              <Box
                sx={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
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
                      <DestinationRow
                        destination={destination}
                        onClick={() => navigate(`/packs/${destination.pageName}`)}
                      />
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Paper>
        )}
      </Stack>
    </PullToRefreshContainer>
  )
}

function DestinationRow({
  destination,
  onClick,
}: {
  destination: Destination
  onClick: () => void
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        minHeight: ROW_HEIGHT,
        px: 2.25,
        py: 1.75,
        justifyContent: 'space-between',
        textAlign: 'left',
        borderBottom: `1px solid ${colors.outlineVariant}`,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: colors.onSurface,
          fontSize: { xs: '1.02rem', sm: '1.08rem' },
          lineHeight: 1.3,
          pr: 2,
        }}
      >
        {destination.displayName}
      </Typography>
      <ChevronRightRoundedIcon
        sx={{
          color: colors.onSurfaceVariant,
          flexShrink: 0,
        }}
      />
    </ButtonBase>
  )
}
