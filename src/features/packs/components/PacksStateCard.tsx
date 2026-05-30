import { Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { colors } from '../../../colors'

type PacksStateCardProps = {
  action?: ReactNode
  description: string
  title: string
}

export function DestinationListSkeleton() {
  return (
    <Stack spacing={1.75} sx={{ pt: 2 }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Paper elevation={0} key={index} sx={destinationSkeletonCardSx}>
          <Stack direction="row" spacing={1.75} sx={{ alignItems: 'center', width: '100%' }}>
            <Skeleton
              animation="wave"
              height={50}
              sx={{ borderRadius: '18px', flexShrink: 0 }}
              variant="rounded"
              width={50}
            />
            <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton animation="wave" height={28} sx={{ borderRadius: 1 }} width="52%" />
              <Skeleton animation="wave" height={18} sx={{ borderRadius: 1 }} width="72%" />
            </Stack>
            <Skeleton
              animation="wave"
              height={40}
              sx={{ borderRadius: 999, flexShrink: 0 }}
              variant="rounded"
              width={40}
            />
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}

export function DestinationPacksSkeleton() {
  return (
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
        <Stack direction="row" spacing={0.75} sx={{ width: 'max-content', p: 0.45 }}>
          {[72, 104, 82].map((width, index) => (
            <Skeleton
              animation="wave"
              height={38}
              key={index}
              sx={{ borderRadius: 999 }}
              variant="rounded"
              width={width}
            />
          ))}
        </Stack>
      </Box>

      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <Stack key={sectionIndex} spacing={1.25} sx={{ px: 0.25 }}>
          <Skeleton animation="wave" height={24} sx={{ borderRadius: 1 }} width={110} />

          <Stack spacing={1.25}>
            {Array.from({ length: 2 }).map((__, cardIndex) => (
              <Paper elevation={0} key={cardIndex} sx={packSkeletonCardSx}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    width: '100%',
                    px: 2.25,
                    py: 2,
                  }}
                >
                  <Stack spacing={0.6} sx={{ minWidth: 0, flex: 1 }}>
                    <Skeleton animation="wave" height={18} sx={{ borderRadius: 1 }} width="32%" />
                    <Skeleton animation="wave" height={34} sx={{ borderRadius: 1 }} width="44%" />
                    <Skeleton animation="wave" height={26} sx={{ borderRadius: 1 }} width="28%" />
                  </Stack>
                  <Skeleton
                    animation="wave"
                    height={24}
                    sx={{ borderRadius: '50%', flexShrink: 0, alignSelf: 'center' }}
                    variant="circular"
                    width={24}
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
}

export function PacksStateCard({ action, description, title }: PacksStateCardProps) {
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

export function PacksRetryButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: () => void
}) {
  return (
    <Button onClick={onClick} sx={retryButtonSx} variant="outlined">
      {children}
    </Button>
  )
}

const stateCardSx = {
  borderRadius: '8px',
  border: `1px solid ${colors.outlineVariant}`,
  px: 2.5,
  py: 3,
} as const

const destinationSkeletonCardSx = {
  minHeight: 108,
  px: 2.25,
  py: 2,
  borderRadius: 2,
  border: `1px solid ${colors.outlineVariant}`,
  backgroundColor: colors.surfaceContainerLowest,
} as const

const packSkeletonCardSx = {
  overflow: 'hidden',
  boxSizing: 'border-box',
  borderRadius: 2,
  border: `1px solid ${colors.outlineVariant}`,
  backgroundColor: colors.surfaceContainerLowest,
} as const

const retryButtonSx = {
  borderColor: colors.primary,
  color: colors.primary,
  '&:hover': {
    borderColor: colors.primary,
    backgroundColor: alpha(colors.primary, 0.04),
    color: colors.primary,
  },
} as const
