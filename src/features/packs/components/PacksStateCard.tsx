import { Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { colors } from '../../../colors'

type PacksStateCardProps = {
  action?: ReactNode
  description: string
  title: string
}

type PacksLoadingStateProps = {
  description: string
  title: string
}

export function PacksLoadingState({ description, title }: PacksLoadingStateProps) {
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
          {title}
        </Typography>
        <Typography sx={{ color: colors.onSurfaceVariant }}>{description}</Typography>
      </Stack>
    </Paper>
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

const retryButtonSx = {
  borderColor: colors.primary,
  color: colors.primary,
  '&:hover': {
    borderColor: colors.primary,
    backgroundColor: alpha(colors.primary, 0.04),
    color: colors.primary,
  },
} as const
