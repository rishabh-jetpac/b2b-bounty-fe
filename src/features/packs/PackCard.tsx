import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, ButtonBase, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { colors } from '../../colors'
import { formatPackPrice, formatValidity } from './packFormatting'
import type { Pack } from './types'

type PackCardProps = {
  onSelect: () => void
  pack: Pack
  selected: boolean
}

export function PackCard({ onSelect, pack, selected }: PackCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        borderRadius: '8px',
        border: selected
          ? `2px solid ${colors.primaryContainer}`
          : `1px solid ${colors.outlineVariant}`,
        boxShadow: selected
          ? `0 16px 32px ${alpha(colors.primary, 0.12)}`
          : `0 10px 24px ${alpha(colors.primary, 0.05)}`,
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
      }}
    >
      <ButtonBase
        onClick={onSelect}
        sx={{
          width: '100%',
          textAlign: 'left',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            px: 2.25,
            py: 2,
          }}
        >
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography
              variant="h3"
              sx={{
                color: colors.onSurface,
                fontSize: { xs: '1.25rem', sm: '1.35rem' },
                lineHeight: 1.25,
              }}
            >
              {pack.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colors.onSurfaceVariant,
              }}
            >
              {formatValidity(pack.validityInDays)}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: selected ? colors.primaryContainer : colors.onSurface,
                fontSize: { xs: '1.6rem', sm: '1.8rem' },
              }}
            >
              {formatPackPrice(pack)}
            </Typography>
          </Stack>

          <Box
            sx={{
              width: 32,
              height: 32,
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
              flexShrink: 0,
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Stack>
      </ButtonBase>
    </Paper>
  )
}
