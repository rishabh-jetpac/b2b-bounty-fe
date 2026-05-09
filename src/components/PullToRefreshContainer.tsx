import { CircularProgress, Stack, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import PullToRefresh from 'react-simple-pull-to-refresh'
import { colors } from '../colors'

type PullToRefreshContainerProps = {
  children: ReactElement
  isPullable?: boolean
  onRefresh: () => Promise<unknown>
}

export function PullToRefreshContainer({
  children,
  isPullable = true,
  onRefresh,
}: PullToRefreshContainerProps) {
  return (
    <PullToRefresh
      backgroundColor={colors.background}
      isPullable={isPullable}
      maxPullDownDistance={92}
      onRefresh={onRefresh}
      pullDownThreshold={72}
      pullingContent={<RefreshIndicator label="Pull to refresh" />}
      refreshingContent={<RefreshIndicator label="Refreshing" loading />}
      resistance={1.75}
    >
      {children}
    </PullToRefresh>
  )
}

type RefreshIndicatorProps = {
  label: string
  loading?: boolean
}

function RefreshIndicator({ label, loading = false }: RefreshIndicatorProps) {
  return (
    <Stack
      spacing={0.75}
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        py: 1.5,
        color: colors.onSurfaceVariant,
      }}
    >
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <CircularProgress size={20} value={100} variant="determinate" />
      )}
      <Typography
        variant="body2"
        sx={{
          color: 'inherit',
        }}
      >
        {label}
      </Typography>
    </Stack>
  )
}
