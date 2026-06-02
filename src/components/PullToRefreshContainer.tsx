import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import PullToRefresh from 'react-simple-pull-to-refresh'
import { colors } from '../colors'

type PullToRefreshContainerProps = {
  backgroundColor?: string
  children: ReactElement
  isPullable?: boolean
  onRefresh: () => Promise<unknown>
}

export function PullToRefreshContainer({
  backgroundColor = colors.background,
  children,
  isPullable = true,
  onRefresh,
}: PullToRefreshContainerProps) {
  return (
    <Box
      sx={{
        backgroundColor,
        height: '100%',
        minHeight: 0,
      }}
    >
      <PullToRefresh
        backgroundColor={backgroundColor}
        className="pull-to-refresh-container"
        isPullable={isPullable}
        maxPullDownDistance={92}
        onRefresh={onRefresh}
        pullDownThreshold={72}
        pullingContent={<RefreshIndicator label="Pull to refresh" />}
        refreshingContent={<RefreshIndicator label="Refreshing" loading />}
        resistance={1.75}
      >
        <Box
          sx={{
            backgroundColor,
            height: '100%',
            minHeight: 0,
          }}
        >
          {children}
        </Box>
      </PullToRefresh>
    </Box>
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
