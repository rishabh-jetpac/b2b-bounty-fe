import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, ButtonBase, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { colors } from '../../../colors'
import { formatDataAmount, formatPackPrice, formatValidity } from '../utils/packFormatting'
import type { Pack } from '../types'

type PackCardProps = {
  onSelect: (selected: boolean) => void
  pack: Pack
  selected: boolean
}

export function PackCard({ onSelect, pack, selected }: PackCardProps) {
  const isUnlimited = pack.dataInGB === -1
  const highlightLabel = isUnlimited ? formatValidity(pack.validityInDays) : formatDataAmount(pack.dataInGB)
  const supportingLabel = isUnlimited ? 'Unlimited data' : formatValidity(pack.validityInDays)

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        borderRadius: 2,
        border: selected
          ? `2px solid ${colors.primaryContainer}`
          : `1px solid ${colors.outlineVariant}`,
        background: selected
          ? `linear-gradient(180deg, ${alpha(colors.primaryFixed, 0.92)} 0%, ${colors.surfaceContainerLowest} 100%)`
          : `linear-gradient(180deg, ${colors.surfaceContainerLowest} 0%, ${alpha(colors.surfaceContainerLow, 0.9)} 100%)`,
        transform: selected ? 'translateY(-1px)' : 'none',
        transition: 'border-color 150ms ease, transform 150ms ease',
      }}
    >
      <ButtonBase
        onClick={() => onSelect(selected)}
        sx={{
          width: '100%',
          textAlign: 'left',
        }}
      >
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
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: colors.onSurfaceVariant,
              }}
            >
              {supportingLabel}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: colors.onSurface,
                fontSize: { xs: '1.4rem', sm: '1.55rem' },
                lineHeight: 1.15,
              }}
            >
              {highlightLabel}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: selected ? colors.primaryContainer : colors.onSurface,
                fontSize: { xs: '1.12rem', sm: '1.2rem' },
                lineHeight: 1.25,
              }}
            >
              {formatPackPrice(pack)}
            </Typography>
          </Stack>

          <Box
            sx={{
              width: 24,
              height: 24,
              alignSelf: 'center',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              border: selected
                ? `2px solid ${colors.primaryContainer}`
                : `2px solid ${colors.outlineVariant}`,
              backgroundColor: selected
                ? colors.primaryContainer
                : colors.surfaceContainerLowest,
              color: selected ? colors.onPrimary : 'transparent',
              boxShadow: selected
                ? `0 0 0 7px ${alpha(colors.primaryFixed, 0.92)}`
                : 'none',
              flexShrink: 0,
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 14 }} />
          </Box>
        </Stack>
      </ButtonBase>
    </Paper>
  )
}
