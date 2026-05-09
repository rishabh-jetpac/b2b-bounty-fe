import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router'
import { useState } from 'react'
import { colors } from '../colors'
import { clearAuthSession, useAuthStore } from '../store/authStore'

type AppShellHeader = {
  rightText?: string
  title: string
}

export function AuthenticatedLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const [header, setHeader] = useState<AppShellHeader>({
    title: 'Packs',
  })
  const [bottomNavigationVisible, setBottomNavigationVisible] = useState(true)
  const [drawerPathname, setDrawerPathname] = useState<string | null>(null)
  const drawerOpen = drawerPathname === location.pathname

  function handleOpenDrawer() {
    setDrawerPathname(location.pathname)
  }

  function handleCloseDrawer() {
    setDrawerPathname(null)
  }

  function handleLogout() {
    handleCloseDrawer()
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  const roleLabel = formatRoleLabel(user?.role)

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
            spacing={1}
            sx={{
              alignItems: 'center',
              minHeight: { xs: 58, sm: 62 },
            }}
          >
            <IconButton
              aria-label="Open account drawer"
              edge="start"
              onClick={handleOpenDrawer}
              sx={{
                color: colors.primaryContainer,
                ml: -1,
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Typography
              variant="h2"
              sx={{
                flex: 1,
                color: colors.primaryContainer,
                fontSize: { xs: '1.6rem', sm: '1.75rem' },
                lineHeight: 1.2,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
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
                  flexShrink: 0,
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

      <Drawer
        anchor="left"
        onClose={handleCloseDrawer}
        open={drawerOpen}
        slotProps={{
          paper: {
            sx: {
              width: 'min(320px, 88vw)',
              backgroundColor: colors.surfaceContainerLowest,
            },
          },
        }}
      >
        <Stack
          sx={{
            minHeight: '100%',
            px: 2,
            pt: 1.5,
            pb: 'calc(24px + env(safe-area-inset-bottom))',
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              sx={{
                color: colors.primaryContainer,
                fontFamily: '"Lexend", sans-serif',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Account
            </Typography>
            <IconButton
              aria-label="Close account drawer"
              onClick={handleCloseDrawer}
              sx={{ color: colors.onSurfaceVariant }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: `1px solid ${colors.outlineVariant}`,
              px: 2,
              py: 2.25,
              background: `linear-gradient(135deg, ${colors.surfaceContainerLow} 0%, ${colors.surfaceContainerLowest} 100%)`,
            }}
          >
            <Stack spacing={1.25}>
              <Box>
                <Typography
                  sx={{
                    color: colors.onSurfaceVariant,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    color: colors.onSurface,
                    fontSize: '1rem',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {user?.email ?? ''}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: colors.outlineVariant }} />

              <Box>
                <Typography
                  sx={{
                    color: colors.onSurfaceVariant,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Organization
                </Typography>
                <Typography
                  sx={{
                    color: colors.onSurface,
                    fontSize: '1rem',
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {user?.orgName ?? ''}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: colors.outlineVariant }} />

              <Box>
                <Typography
                  sx={{
                    color: colors.onSurfaceVariant,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Role
                </Typography>
                <Typography
                  sx={{
                    color: colors.onSurface,
                    fontSize: '1rem',
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {roleLabel}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Box sx={{ flex: 1 }} />

          <Button
            fullWidth
            onClick={handleLogout}
            startIcon={<LogoutRoundedIcon />}
            sx={{
              minHeight: 48,
              borderRadius: '14px',
              backgroundColor: colors.primaryContainer,
              color: colors.onPrimary,
              '&:hover': {
                backgroundColor: colors.primary,
              },
            }}
            variant="contained"
          >
            Log out
          </Button>
        </Stack>
      </Drawer>

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
                label="Inventory"
                value="/inventory"
                component={RouterLink}
                icon={<Inventory2OutlinedIcon />}
                to="/inventory"
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

function formatRoleLabel(role?: string) {
  if (!role) {
    return ''
  }

  return role
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(' ')
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
