import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { Box, ButtonBase, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { colors } from '../../../colors'
import type { Destination } from '../types'
import { getDestinationMonogram } from '../utils/destinationFormatting'

type DestinationCardProps = {
  destination: Destination
  onClick: () => void
}

export function DestinationCard({ destination, onClick }: DestinationCardProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        minHeight: 108,
        px: 2.25,
        py: 2,
        borderRadius: 2,
        justifyContent: 'flex-start',
        textAlign: 'left',
        border: `1px solid ${alpha(colors.primaryFixedDim, 0.52)}`,
        backgroundColor: colors.surfaceContainerLowest,
        boxShadow: 'none',
        transition: 'border-color 180ms ease',
        '&:hover': {
          boxShadow: 'none',
          borderColor: alpha(colors.primaryContainer, 0.4),
        },
        '&:focusVisible': {
          outline: `3px solid ${alpha(colors.primaryContainer, 0.22)}`,
          outlineOffset: 2,
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1.75}
        sx={{
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: '18px',
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryContainer} 52%, ${colors.primaryFixedDim} 100%)`,
            color: colors.onPrimary,
            boxShadow: `0 10px 18px ${alpha(colors.primary, 0.18)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}
          >
            {getDestinationMonogram(destination.displayName)}
          </Typography>
        </Box>

        <Stack
          spacing={0.45}
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: colors.onSurface,
              fontSize: { xs: '1.15rem', sm: '1.22rem' },
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {destination.displayName}
          </Typography>
          <Typography
            sx={{
              color: colors.onSurfaceVariant,
              fontSize: '0.88rem',
              lineHeight: 1.45,
            }}
          >
            Browse packs for {destination.displayName}
          </Typography>
        </Stack>

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 999,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            border: `1px solid ${alpha(colors.primaryContainer, 0.14)}`,
            backgroundColor: alpha(colors.primaryContainer, 0.08),
          }}
        >
          <ChevronRightRoundedIcon
            sx={{
              color: colors.primaryContainer,
              flexShrink: 0,
            }}
          />
        </Box>
      </Stack>
    </ButtonBase>
  )
}
