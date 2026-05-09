import { Paper, Stack, Typography } from '@mui/material'
import { useAuthenticatedHeader } from '../app/useAuthenticatedHeader'
import { colors } from '../colors'

function WalletRoute() {
  useAuthenticatedHeader({
    title: 'Wallet',
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
          Wallet details are not implemented in this pass
        </Typography>
        <Typography sx={{ color: colors.onSurfaceVariant }}>
          The packs flow owns local balance updates for now. This route is only
          here to complete the new authenticated navigation shell.
        </Typography>
      </Stack>
    </Paper>
  )
}

export default WalletRoute
