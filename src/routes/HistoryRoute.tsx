import { Paper, Stack, Typography } from '@mui/material'
import { useAuthenticatedHeader } from '../app/useAuthenticatedHeader'
import { colors } from '../colors'

function HistoryRoute() {
  useAuthenticatedHeader({
    title: 'History',
  })

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '8px',
        border: `1px solid ${colors.outlineVariant}`,
        px: 2.5,
        py: 3,
      }}
    >
      <Stack spacing={1.25}>
        <Typography variant="h3" sx={{ color: colors.onSurface }}>
          Purchase history is coming next
        </Typography>
        <Typography sx={{ color: colors.onSurfaceVariant }}>
          This placeholder keeps the authenticated shell wired while the actual
          ledger experience is still out of scope.
        </Typography>
      </Stack>
    </Paper>
  )
}

export default HistoryRoute
