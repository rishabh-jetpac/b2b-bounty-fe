import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  Link as RouterLink,
  Outlet,
  useLocation,
} from 'react-router'
import { useState } from 'react'
import { colors } from '../colors'

type AppShellHeader = {
  rightText?: string
  title: string
}

export function AuthenticatedLayout() {
  const location = useLocation()
  const [header, setHeader] = useState<AppShellHeader>({
    title: 'Packs',
  })
  const [bottomNavigationVisible, setBottomNavigationVisible] = useState(true)

  return (
    <Box
      sx={{
        minHeight: '100svh',
        backgroundColor: colors.background,
      }}
    >
      <Paper
        elevation={0}
        square
        sx={{
          position: 'fixed',
          inset: '0 0 auto 0',
          zIndex: (theme) => theme.zIndex.appBar,
          borderBottom: `1px solid ${colors.outlineVariant}`,
          backgroundColor: colors.surfaceContainerLowest,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            px: { xs: 2, sm: 3 },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: { xs: 58, sm: 62 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: colors.primaryContainer,
                fontSize: { xs: '1.6rem', sm: '1.75rem' },
                lineHeight: 1.2,
              }}
            >
              {header.title}
            </Typography>
            {header.rightText ? (
              <Typography
                sx={{
                  color: colors.primaryContainer,
                  fontFamily: '"Lexend", sans-serif',
                  fontSize: { xs: '1rem', sm: '1.05rem' },
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {header.rightText}
              </Typography>
            ) : null}
          </Stack>
        </Container>
      </Paper>

      <Container
        maxWidth="sm"
        sx={{
          px: { xs: 2, sm: 3 },
          pt: { xs: 9.5, sm: 10.25 },
          pb: bottomNavigationVisible
            ? 'calc(108px + env(safe-area-inset-bottom))'
            : 'calc(24px + env(safe-area-inset-bottom))',
        }}
      >
        <Outlet context={{ setBottomNavigationVisible, setHeader }} />
      </Container>

      {bottomNavigationVisible ? (
        <Paper
          elevation={0}
          square
          sx={{
            position: 'fixed',
            inset: 'auto 0 0 0',
            zIndex: (theme) => theme.zIndex.appBar,
            borderTop: `1px solid ${colors.outlineVariant}`,
            backgroundColor: colors.surfaceContainerLowest,
            pb: 'env(safe-area-inset-bottom)',
          }}
        >
          <Container
            maxWidth="sm"
            disableGutters
            sx={{
              px: { xs: 1, sm: 2 },
            }}
          >
            <BottomNavigation
              showLabels
              value={location.pathname}
              sx={{
                height: 74,
                backgroundColor: 'transparent',
              }}
            >
              <BottomNavigationAction
                label="Packs"
                value="/packs"
                component={RouterLink}
                icon={<ShoppingBagOutlinedIcon />}
                to="/packs"
                sx={bottomNavigationActionSx}
              />
              <BottomNavigationAction
                label="History"
                value="/history"
                component={RouterLink}
                icon={<HistoryOutlinedIcon />}
                to="/history"
                sx={bottomNavigationActionSx}
              />
              <BottomNavigationAction
                label="Wallet"
                value="/wallet"
                component={RouterLink}
                icon={<AccountBalanceWalletOutlinedIcon />}
                to="/wallet"
                sx={bottomNavigationActionSx}
              />
            </BottomNavigation>
          </Container>
        </Paper>
      ) : null}
    </Box>
  )
}

const bottomNavigationActionSx = {
  color: colors.onSurfaceVariant,
  borderRadius: 2,
  '& .MuiBottomNavigationAction-label': {
    fontFamily: '"Lexend", sans-serif',
    fontSize: '0.78rem',
    fontWeight: 500,
  },
  '&.Mui-selected': {
    color: colors.primaryContainer,
  },
  '&.Mui-selected .MuiBottomNavigationAction-label': {
    fontWeight: 700,
  },
} as const
